import { ListObjectsCommandOutput } from '@aws-sdk/client-s3';
import { FileDataDTO } from '@pdf-generator/shared';
import { getFileDataFromKey } from '../endpoints/utils';

export const mapGetFilesResponse = (
  output: ListObjectsCommandOutput,
  includeFolder: boolean = false
): FileDataDTO[] => {
  if (!output.Contents) {
    return [];
  }
  const files = output.Contents.map(file =>
    getFileDataFromKey(file.Key, file.LastModified.toISOString())
  );
  if (includeFolder) {
    return files;
  }
  return files.filter(file => !!file.filename);
};
