import { FileDataDTO } from '@pdf-generator/shared';
import { ListItem } from './FileItem.styles';

type Props = { file: FileDataDTO };
export const FileItem = ({ file }: Props) => {
  return <ListItem>{file.filename}</ListItem>;
};
