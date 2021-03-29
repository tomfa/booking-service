import {
  S3Client,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileDataDTO } from '@pdf-generator/shared';
import config from '../config';
import { FOLDER } from '../endpoints/enums';
import { getFileDataFromKey } from '../endpoints/utils';
import { TemplateNotFound } from './errors/TemplateNotFound';
import { APIError } from './errors/APIError';
import { mapGetFilesResponse } from './files.mapper';

const s3 = new S3Client({ region: config.services.s3.region });
const generateFileName = (fileEnding = 'pdf') => `${v4()}.${fileEnding}`;

export const retrieveTemplate = async (
  templateName: string
): Promise<string | null> => {
  const prefix = 'templates';
  try {
    const object = await s3.send(
      new GetObjectCommand({
        Bucket: config.services.s3.bucketName,
        Key: `${prefix}/${templateName}`,
      })
    );
    return object.Body.toString();
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

export const store = async (
  content: Buffer,
  mimeType = 'application/pdf',
  acl: 'public-read' | 'private' = 'public-read'
): Promise<FileDataDTO> => {
  const fileName = generateFileName();
  const prefix = 'files';
  const key = `${prefix}/${fileName}`;
  return upload({ key, mimeType, acl, content });
};

export const list = async ({
  folder,
}: {
  folder: FOLDER;
}): Promise<FileDataDTO[]> => {
  const response = await s3.send(
    new ListObjectsCommand({
      Bucket: config.services.s3.bucketName,
      Prefix: `${folder}/`,
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

export const getUploadUrl = async (
  folder: FOLDER,
  fileKey: string,
  acl: 'public-read' | 'private' = 'public-read',
  { expiresIn = 15 * 60 }: { expiresIn?: number } = {}
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: config.services.s3.bucketName,
    Key: `${folder}/${fileKey}`,
    ACL: acl,
  });
  const url = await getSignedUrl(s3, command, { expiresIn });
  return url;
};
