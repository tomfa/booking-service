import { FileDataDTO } from '@pdf-generator/shared';
import { DateStamp, ListItem } from './FileItem.styles';

type Props = { file: FileDataDTO };
export const FileItem = ({ file }: Props) => {
  return (
    <a href={file.url}>
      <ListItem>
        <span>{file.filename}</span>
        <DateStamp>{formatISOstring(file.modified)}</DateStamp>
      </ListItem>
    </a>
  );
};

const formatISOstring = (date: string) => {
  return date.substring(0, 16).replace('T', ' ');
};
