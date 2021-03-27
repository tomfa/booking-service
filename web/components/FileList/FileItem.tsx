import { FileDataDTO } from '@pdf-generator/shared';
import { DateStamp, ListItem } from './FileItem.styles';
import { formatISOstring } from './date.utils';

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
