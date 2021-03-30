import { useEffect, useState } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { FileList } from '../components/FileList/FileList';
import { useData } from '../providers/DataProvider';
import { LineHeader } from '../components/LineHeader';

export const Files = ({
  onArchive,
  onDelete,
}: {
  onArchive: (file: FileDataDTO) => Promise<void>;
  onDelete: (file: FileDataDTO) => Promise<void>;
}) => {
  const [showArchive, setShowArchive] = useState(false);

  const { isFetching, files, archivedFiles } = useData();
  useEffect(() => {
    if (archivedFiles.length === 0) {
      setShowArchive(false);
    }
  }, [setShowArchive, archivedFiles]);
  return (
    <span className="card">
      <LineHeader
        header={'Generated PDFs'}
        onClick={() => setShowArchive(k => !k)}
        buttonLabel={(showArchive && 'Hide archived') || 'Show archived'}
        hideButton={archivedFiles.length === 0}
      />
      {!showArchive && (
        <FileList files={files} isLoading={isFetching} onDelete={onArchive} />
      )}
      {showArchive && (
        <FileList
          files={archivedFiles}
          isLoading={isFetching}
          onDelete={onDelete}
        />
      )}
    </span>
  );
};
