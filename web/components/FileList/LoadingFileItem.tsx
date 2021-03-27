import { LoadingListItem } from './LoadingFileItem.styles';
import { DateStamp } from './FileItem.styles';
import { formatISOstring } from './date.utils';

export const LoadingFileItem = () => {
  return (
    <LoadingListItem>
      <span>Justaplaceholder.html</span>
      <DateStamp>{formatISOstring('2025-13-08T01:15:13')}</DateStamp>
    </LoadingListItem>
  );
};
