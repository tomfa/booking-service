import {
  ListObjectsCommandOutput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { FileData } from '../types';
import config from '../config';

const getAbsoluteUrl = (fileKey: string) =>
  `${config.services.s3.endpointUrl}/${fileKey}`;

const getFileName = (fileKey: string) => fileKey.split('/').reverse()[0];

export const mapGetFilesResponse = (
  output: ListObjectsCommandOutput,
  includeFolder: boolean = false
): FileData[] => {
  if (!output.Contents) {
    return [];
  }
  const files = output.Contents.map((file) => {
    return {
      key: file.Key,
      filename: getFileName(file.Key),
      eTag: file.ETag,
      modified: file.LastModified,
      url: getAbsoluteUrl(file.Key),
    };
  });
  if (includeFolder) {
    return files;
  }
  return files.filter((file) => !!file.filename);
};

export const mapPutFileResponse = (
  uploadKey: string,
  output: PutObjectCommandOutput
): FileData => {
  return {
    key: uploadKey,
    filename: getFileName(uploadKey),
    eTag: output.ETag,
    url: getAbsoluteUrl(uploadKey),
  };
};
