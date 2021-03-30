import { useEffect, useState } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { FileDrop } from '../components/FileDrop';
import { FileList } from '../components/FileList/FileList';
import { useData } from '../providers/DataProvider';
import { LineHeader } from '../components/LineHeader';
import { Card } from '../components/Card.styles';
import { IconType } from '../components/Icon';

export const Fonts = ({
  onArchive,
  onDelete,
}: {
  onArchive: (file: FileDataDTO) => Promise<void>;
  onDelete: (file: FileDataDTO) => Promise<void>;
}) => {
  const [selected, setSelected] = useState<null | FileDataDTO>(null);
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
    <Card>
      <LineHeader
        icon={IconType.FONT}
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
        <FileList
          files={fonts}
          isLoading={isFetching}
          onDelete={onArchive}
          onSelect={setSelected}
          selectedFile={selected}
        />
      )}
      {showArchive && (
        <FileList
          files={archivedFonts}
          isLoading={isFetching}
          onDelete={onDelete}
          onSelect={setSelected}
          selectedFile={selected}
        />
      )}
    </Card>
  );
};
