import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';

type FileData = { url: string };

const s3 = new S3();
const generateFileName = (fileEnding = 'pdf') => `${v4()}.${fileEnding}`;

export const retrieveTemplate = async ( templateName: string ): Promise<string> => {
  const prefix = 'templates';
  const object = await s3.getObject({
    Bucket: 'pdfs.webutvikling.org',
    Key: `${prefix}/${templateName}`,
  }).promise()
  return object.Body.toString('utf-8');
}

export const storeFile = async (
  content: Buffer,
  mimeType = 'application/pdf',
  acl: 'public-read' | 'private' = 'public-read',
): Promise<FileData> => {
  const fileName = generateFileName();
  const prefix = 'files';
  await s3
    .putObject({
      Bucket: 'pdfs.webutvikling.org',
      Key: `${prefix}/${fileName}`,
      Body: content,
      ContentType: mimeType,
      ACL: acl,
    })
    .promise();
  const url = `https://s3.eu-north-1.amazonaws.com/pdfs.webutvikling.org/${prefix}/${fileName}`;
  return { url };
};

export const storeTemplate = async ({ content, templateName, mimeType = 'text/html', acl = 'public-read' }: {
  content: Buffer,
  templateName: string,
  mimeType: string,
  acl: 'public-read' | 'private',
}) => {
  const prefix = 'templates';
  await s3
    .putObject({
      Bucket: 'pdfs.webutvikling.org',
      Key: `${prefix}/${templateName}`,
      Body: content,
      ContentType: mimeType,
      ACL: acl,
    })
    .promise();
  const url = `https://s3.eu-north-1.amazonaws.com/pdfs.webutvikling.org/${prefix}/${templateName}`;
  return { url };
};
