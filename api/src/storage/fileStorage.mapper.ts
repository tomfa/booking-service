import { ListObjectsCommandOutput } from '@aws-sdk/client-s3';
import { FileDataDTO } from '@booking-service/shared';
import { getFileDataFromKey } from '../endpoints/utils';

export const mapGetFilesResponse = (
  output: ListObjectsCommandOutput
): FileDataDTO[] => {
  if (!output.Contents) {
    return [];
  }
  const filesWithoutFolder = output.Contents.filter(o => !o.Key.endsWith('/'));
  return filesWithoutFolder.map(file =>
    getFileDataFromKey(file.Key, file.LastModified.toISOString())
  );
};
