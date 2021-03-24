import { FileDataDTO } from '@pdf-generator/shared';
import { FileItem } from './FileItem';
import { List } from './FileList.styles';

type Props = { files: FileDataDTO[] };
export const FileList = ({ files }: Props) => {
  return (
    <List>
      {files.map((file) => (
        <FileItem key={file.url} file={file} />
      ))}
    </List>
  );
};
