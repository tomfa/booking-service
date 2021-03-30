import { useEffect, useState } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { FileList } from '../components/FileList/FileList';
import { useData } from '../providers/DataProvider';
import { LineHeader } from '../components/LineHeader';
import { Card } from '../components/Card.styles';

export const Files = ({
  onArchive,
  onDelete,
}: {
  onArchive: (file: FileDataDTO) => Promise<void>;
  onDelete: (file: FileDataDTO) => Promise<void>;
}) => {
  const [showArchive, setShowArchive] = useState(false);
  const [selected, setSelected] = useState<null | FileDataDTO>(null);

  const { isFetching, files, archivedFiles } = useData();
  useEffect(() => {
    if (archivedFiles.length === 0) {
      setShowArchive(false);
    }
  }, [setShowArchive, archivedFiles]);
  return (
    <Card>
      <LineHeader
        header={'PDFs'}
        onClick={() => setShowArchive(k => !k)}
        buttonLabel={(showArchive && 'Hide archived') || 'Show archived'}
        hideButton={archivedFiles.length === 0}
      />
      {!showArchive && (
        <FileList
          files={files}
          isLoading={isFetching}
          onDelete={onArchive}
          selectedFile={selected}
          onSelect={setSelected}
        />
      )}
      {showArchive && (
        <FileList
          files={archivedFiles}
          isLoading={isFetching}
          onDelete={onDelete}
          selectedFile={selected}
          onSelect={setSelected}
        />
      )}
    </Card>
  );
};
