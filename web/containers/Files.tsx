import { useEffect, useMemo, useState } from 'react';
import { FileDataDTO } from '@booking-service/shared';
import { FileList } from '../components/FileList/FileList';
import { useData } from '../providers/DataProvider';
import { LineHeader } from '../components/LineHeader';
import { Card } from '../components/Card.styles';
import { IconType } from '../components/Icon';

export const Files = ({
  onDelete,
}: {
  onDelete: (file: FileDataDTO) => Promise<void>;
}) => {
  const [showArchive, setShowArchive] = useState(false);
  const [selected, setSelected] = useState<null | FileDataDTO>(null);

  const { isFetching, files } = useData();
  const nonArchivedFiles = useMemo(() => files.filter(f => !f.archived), [
    files,
  ]);
  const hasArchivedFiles = nonArchivedFiles.length < files.length;

  useEffect(() => {
    if (!hasArchivedFiles) {
      setShowArchive(false);
    }
  }, [setShowArchive, hasArchivedFiles]);
  return (
    <Card>
      <LineHeader
        icon={IconType.DOWNLOAD_DOCUMENT}
        header={'PDFs'}
        onClick={() => setShowArchive(k => !k)}
        buttonLabel={(showArchive && 'Hide archived') || 'Show archived'}
        hideButton={!hasArchivedFiles}
      />
      <FileList
        files={showArchive ? files : nonArchivedFiles}
        isLoading={isFetching}
        onDelete={onDelete}
        selectedFile={selected}
        onSelect={setSelected}
      />
    </Card>
  );
};
