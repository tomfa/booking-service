import { FileDataDTO } from '@pdf-generator/shared';
import { useCallback, useMemo } from 'react';
import { MessageType, useMessage } from '../../providers/MessageProvider';
import { useData } from '../../providers/DataProvider';
import { FileItem } from './FileItem';
import { List } from './FileList.styles';
import { LoadingFileItem } from './LoadingFileItem';

type Props = {
  files: FileDataDTO[];
  isLoading: boolean;
  selectedFile?: FileDataDTO | null;
  onSelect?: (file: FileDataDTO | null) => void;
};
export const FileList = ({
  files,
  isLoading,
  selectedFile,
  onSelect,
}: Props) => {
  const blurArray = useMemo(() => Array.from(Array(3).keys()), []);
  const { addMessage } = useMessage();
  const { deleteFile } = useData();
  const onDelete = useCallback(
    async (file: FileDataDTO) => {
      await deleteFile(file);
      addMessage({
        title: `${file.filename} was deleted`,
        type: MessageType.INFO,
      });
    },
    [deleteFile, addMessage]
  );

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
        <FileItem
          key={file.url}
          file={file}
          onSelect={onSelect}
          isSelected={file === selectedFile}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
};
