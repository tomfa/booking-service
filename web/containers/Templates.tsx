import { useEffect, useState } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { FileDrop } from '../components/FileDrop';
import { FileList } from '../components/FileList/FileList';
import { useData } from '../providers/DataProvider';
import { LineHeader } from '../components/LineHeader';
import { Card } from '../components/Card.styles';

export const Templates = ({
  onArchive,
  onDelete,
  onSelect,
  selected,
}: {
  onArchive: (file: FileDataDTO) => Promise<void>;
  onDelete: (file: FileDataDTO) => Promise<void>;
  onSelect: (file: FileDataDTO) => void;
  selected: FileDataDTO | null;
}) => {
  const [showArchive, setShowArchive] = useState(false);

  const {
    uploadTemplates,
    isFetching,
    isUploadingTemplates,
    templates,
    archivedTemplates,
  } = useData();
  useEffect(() => {
    if (archivedTemplates.length === 0) {
      setShowArchive(false);
    }
  }, [setShowArchive, archivedTemplates]);
  return (
    <Card>
      <LineHeader
        header={'Templates'}
        onClick={() => setShowArchive(k => !k)}
        buttonLabel={(showArchive && 'Hide archived') || 'Show archived'}
        hideButton={archivedTemplates.length === 0}
      />

      <FileDrop
        title={'Upload new template'}
        onDrop={uploadTemplates}
        isLoading={isUploadingTemplates}
        mimeTypes={['.svg', '.html', 'image/svg', 'text/html']}
      />
      {!showArchive && (
        <FileList
          files={templates}
          isLoading={isFetching}
          onSelect={onSelect}
          selectedFile={selected}
          onDelete={onArchive}
        />
      )}
      {showArchive && (
        <FileList
          files={archivedTemplates}
          isLoading={isFetching}
          onDelete={onDelete}
          onSelect={onSelect}
          selectedFile={selected}
        />
      )}
    </Card>
  );
};
