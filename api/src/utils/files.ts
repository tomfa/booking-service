import { Readable } from 'stream';
import {
  S3Client,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import * as uuid from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileDataDTO, FOLDER } from '@pdf-generator/shared';
import config from '../config';
import { getFileDataFromKey, getKeyFromData } from '../endpoints/utils';
import { TemplateNotFound } from './errors/TemplateNotFound';
import { APIError } from './errors/APIError';
import { mapGetFilesResponse } from './files.mapper';

async function readableToString(readable: Readable): Promise<string> {
  let result = '';
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}

const s3 = new S3Client({ region: config.services.s3.region });

type RetrieveTemplateProps = {
  owner: string;
  id: string;
  templateName: string;
};
export const retrieveTemplate = async ({
  owner,
  id,
  templateName,
}: RetrieveTemplateProps): Promise<string | null> => {
  const folder = FOLDER.templates;
  const key = `${owner}/${folder}/${id}/${templateName}`;
  try {
    const object = await s3.send(
      new GetObjectCommand({
        Bucket: config.services.s3.bucketName,
        Key: key,
      })
    );
    return readableToString(object.Body as Readable);
  } catch (err) {
    if (err.code === 'NoSuchKey') {
      throw new TemplateNotFound(`Unable to find template.`, { templateName });
    }
    throw new APIError(err, { function: 'retrieveTemplate', templateName });
  }
};

const upload = async ({
  content,
  key,
  mimeType,
  acl,
}: {
  content: Buffer;
  key: string;
  mimeType: string;
  acl: 'public-read' | 'private';
}): Promise<FileDataDTO> => {
  await s3.send(
    new PutObjectCommand({
      Bucket: config.services.s3.bucketName,
      Key: key,
      Body: content,
      ContentType: mimeType,
      ACL: acl,
    })
  );
  return getFileDataFromKey(key, new Date().toISOString());
};

export const store = async ({
  owner,
  content,
  filename = 'file.pdf',
  folder = FOLDER.files,
  mimeType = 'application/pdf',
  acl = 'public-read',
}: {
  owner: string;
  content: Buffer;
  filename: string;
  folder?: FOLDER;
  mimeType?: 'application/pdf' | string;
  acl?: 'public-read' | 'private';
}): Promise<FileDataDTO> => {
  const id = uuid.v4();
  const key = getKeyFromData({
    owner,
    folder,
    id,
    filename,
    modified: '',
    archived: false,
  });
  return upload({ key, mimeType, acl, content });
};

export const list = async ({
  folder,
  owner,
}: {
  folder: FOLDER;
  owner: string;
}): Promise<FileDataDTO[]> => {
  const response = await s3.send(
    new ListObjectsCommand({
      Bucket: config.services.s3.bucketName,
      Prefix: `${owner}/${folder}/`,
    })
  );
  return mapGetFilesResponse(response);
};

export const remove = async ({ keys }: { keys: string[] }): Promise<void> => {
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: config.services.s3.bucketName,
      Delete: {
        Objects: keys.map(key => ({ Key: key })),
      },
    })
  );
};

type GetUploadUrlProps = {
  owner: string;
  folder: FOLDER;
  filename: string;
  id?: string;
  acl?: 'public-read' | 'private';
  options?: { expiresIn?: number };
};
export const getUploadUrl = async ({
  owner,
  folder,
  filename,
  id = uuid.v4(),
  acl = 'public-read',
  options: { expiresIn = 15 * 60 } = {},
}: GetUploadUrlProps): Promise<FileDataDTO> => {
  const command = new PutObjectCommand({
    Bucket: config.services.s3.bucketName,
    Key: `${owner}/${folder}/${id}/${filename}`,
    ACL: acl,
  });
  const url = await getSignedUrl(s3, command, { expiresIn });
  return {
    url,
    owner,
    folder,
    filename,
    id,
    archived: false,
    modified: 'Just now',
  };
};
