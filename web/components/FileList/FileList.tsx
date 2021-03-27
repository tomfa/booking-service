import { FileDataDTO } from '@pdf-generator/shared';
import { useMemo } from 'react';
import { FileItem } from './FileItem';
import { List } from './FileList.styles';
import { LoadingFileItem } from './LoadingFileItem';

type Props = { files: FileDataDTO[]; isLoading: boolean };
export const FileList = ({ files, isLoading }: Props) => {
  const blurArray = useMemo(() => Array.from(Array(3).keys()), []);
  if (isLoading) {
    return (
      <List>
        {blurArray.map(i => (
          <LoadingFileItem key={i} />
        ))}
      </List>
    );
  }
  return (
    <List>
      {files.map(file => (
        <FileItem key={file.url} file={file} />
      ))}
    </List>
  );
};
