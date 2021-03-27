import {
  S3Client,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '../config';
import { FileData } from '../types';
import { FOLDER } from '../endpoints/enums';
import { TemplateNotFound } from './errors/TemplateNotFound';
import { APIError } from './errors/APIError';
import { mapGetFilesResponse, mapPutFileResponse } from './files.mapper';

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

const uploadFile = async ({
  content,
  key,
  mimeType,
  acl,
}: {
  content: Buffer;
  key: string;
  mimeType: string;
  acl: 'public-read' | 'private';
}): Promise<FileData> => {
  const object = await s3.send(
    new PutObjectCommand({
      Bucket: config.services.s3.bucketName,
      Key: key,
      Body: content,
      ContentType: mimeType,
      ACL: acl,
    })
  );
  return mapPutFileResponse(key, object);
};

export const storeFile = async (
  content: Buffer,
  mimeType = 'application/pdf',
  acl: 'public-read' | 'private' = 'public-read'
): Promise<FileData> => {
  const fileName = generateFileName();
  const prefix = 'files';
  const key = `${prefix}/${fileName}`;
  return uploadFile({ key, mimeType, acl, content });
};

export const getFiles = async ({
  folder,
}: {
  folder: FOLDER;
}): Promise<FileData[]> => {
  const response = await s3.send(
    new ListObjectsCommand({
      Bucket: config.services.s3.bucketName,
      Prefix: `${folder}/`,
    })
  );
  return mapGetFilesResponse(response);
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
