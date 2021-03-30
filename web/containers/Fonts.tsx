import { useEffect, useState } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { FileDrop } from '../components/FileDrop';
import { FileList } from '../components/FileList/FileList';
import { useData } from '../providers/DataProvider';
import { LineHeader } from '../components/LineHeader';

export const Fonts = ({
  onArchive,
  onDelete,
}: {
  onArchive: (file: FileDataDTO) => Promise<void>;
  onDelete: (file: FileDataDTO) => Promise<void>;
}) => {
  const [showArchive, setShowArchive] = useState(false);
  const {
    uploadFonts,
    isFetching,
    isUploadingFonts,
    fonts,
    archivedFonts,
  } = useData();
  useEffect(() => {
    if (archivedFonts.length === 0) {
      setShowArchive(false);
    }
  }, [setShowArchive, archivedFonts]);
  return (
    <span className="card">
      <LineHeader
        header={'Fonts'}
        onClick={() => setShowArchive(k => !k)}
        buttonLabel={(showArchive && 'Hide archived') || 'Show archived'}
        hideButton={archivedFonts.length === 0}
      />

      <FileDrop
        title={'Upload new fonts'}
        onDrop={uploadFonts}
        isLoading={isUploadingFonts}
        mimeTypes={['.otf', 'application/vnd.ms-opentype']}
      />

      {!showArchive && (
        <FileList files={fonts} isLoading={isFetching} onDelete={onArchive} />
      )}
      {showArchive && (
        <FileList
          files={archivedFonts}
          isLoading={isFetching}
          onDelete={onDelete}
        />
      )}
    </span>
  );
};
