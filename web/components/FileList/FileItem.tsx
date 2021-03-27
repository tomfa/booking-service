import { FileDataDTO } from '@pdf-generator/shared';
import { IsoToDisplayDateTime } from '../utils/date.utils';
import { DateStamp, ListItem, ListItemText } from './FileItem.styles';
import { FileActions } from './FileActions';

type Props = { file: FileDataDTO };
export const FileItem = ({ file }: Props) => {
  return (
    <ListItem>
      <ListItemText>{file.filename}</ListItemText>
      <FileActions file={file} />
      <DateStamp>{IsoToDisplayDateTime(file.modified)}</DateStamp>
    </ListItem>
  );
};
