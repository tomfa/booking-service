import { IsoToDisplayDateTime } from '../utils/date.utils';
import { LoadingListItem } from './LoadingFileItem.styles';
import { DateStamp, ListItemText } from './FileItem.styles';

export const LoadingFileItem = () => {
  return (
    <LoadingListItem>
      <ListItemText>Justaplaceholder.html</ListItemText>
      <DateStamp>{IsoToDisplayDateTime('2025-13-08T01:15:13')}</DateStamp>
    </LoadingListItem>
  );
};
