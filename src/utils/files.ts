import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';
import { TemplateNotFound } from './errors/TemplateNotFound';
import { APIError } from './errors/APIError';
import config from '../config';

type FileData = { url: string };

const s3 = new S3();
const generateFileName = (fileEnding = 'pdf') => `${v4()}.${fileEnding}`;

const getAbsoluteUrl = (fileKey: string) =>
  `${config.services.s3.endpointUrl}/${fileKey}`;

export const retrieveTemplate = async (
  templateName: string,
): Promise<string | null> => {
  const prefix = 'templates';
  try {
    const object = await s3
      .getObject({
        Bucket: config.services.s3.bucketName,
        Key: `${prefix}/${templateName}`,
      })
      .promise();
    return object.Body.toString('utf-8');
  } catch (err) {
    if (err.code === 'NoSuchKey') {
      throw new TemplateNotFound(`Unable to find template.`, { templateName });
    }
    throw new APIError(err, { function: 'retrieveTemplate', templateName });
  }
};

export const storeFile = async (
  content: Buffer,
  mimeType = 'application/pdf',
  acl: 'public-read' | 'private' = 'public-read',
): Promise<FileData> => {
  const fileName = generateFileName();
  const prefix = 'files';
  await s3
    .putObject({
      Bucket: config.services.s3.bucketName,
      Key: `${prefix}/${fileName}`,
      Body: content,
      ContentType: mimeType,
      ACL: acl,
    })
    .promise();
  const url = getAbsoluteUrl(`${prefix}/${fileName}`);
  return { url };
};

export const storeTemplate = async ({
  content,
  templateName,
  mimeType = 'text/html',
  acl = 'public-read',
}: {
  content: Buffer;
  templateName: string;
  mimeType: string;
  acl: 'public-read' | 'private';
}) => {
  const prefix = 'templates';
  await s3
    .putObject({
      Bucket: config.services.s3.bucketName,
      Key: `${prefix}/${templateName}`,
      Body: content,
      ContentType: mimeType,
      ACL: acl,
    })
    .promise();
  const url = getAbsoluteUrl(`${prefix}/${templateName}`);
  return { url };
};
