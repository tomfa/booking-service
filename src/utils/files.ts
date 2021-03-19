import * as AWS from 'aws-sdk';
import { v4 } from 'uuid';

type FileData = { url: string };

const s3 = new AWS.S3();
const generateFileName = (fileEnding = 'pdf') => `${v4()}.${fileEnding}`;

export const storeFile = async (
  content: Buffer,
  mimeType = 'application/pdf',
  acl: 'public-read' | 'private' = 'public-read'
): Promise<FileData> => {
  const fileName = generateFileName();
  const prefix = 'files';
  await s3
    .putObject({
      Bucket: 'pdfs.webutvikling.org',
      Key: `${prefix}/${fileName}`,
      Body: content,
      ContentType: mimeType,
      ACL: acl
    })
    .promise();
  const url = `https://s3.eu-north-1.amazonaws.com/pdfs.webutvikling.org/${prefix}/${fileName}`
  return { url };
};
