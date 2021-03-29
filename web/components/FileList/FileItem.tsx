import { FileDataDTO } from '@pdf-generator/shared';
import { IsoToDisplayDateTime } from '../utils/date.utils';
import { DateStamp, ListItem, ListItemText } from './FileItem.styles';
import { FileActions } from './FileActions';

type Props = {
  file: FileDataDTO;
  isSelected?: boolean;
  onSelect?: (file: FileDataDTO) => void;
  onDelete?: (file: FileDataDTO) => void;
};
export const FileItem = ({ file, isSelected, onSelect, onDelete }: Props) => {
  return (
    <ListItem
      onClick={() => onSelect && onSelect(file)}
      $selected={isSelected}
      $selectable={!!onSelect}>
      <ListItemText>{file.filename}</ListItemText>
      <FileActions file={file} onDelete={onDelete} />
      <DateStamp>{IsoToDisplayDateTime(file.modified)}</DateStamp>
    </ListItem>
  );
};
