import { useEffect, useMemo, useState } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { FileDrop } from '../components/FileDrop';
import { FileList } from '../components/FileList/FileList';
import { useData } from '../providers/DataProvider';
import { LineHeader } from '../components/LineHeader';
import { Card } from '../components/Card.styles';
import { IconType } from '../components/Icon';

export const Fonts = ({
  onDelete,
}: {
  onDelete: (file: FileDataDTO) => Promise<void>;
}) => {
  const [selected, setSelected] = useState<null | FileDataDTO>(null);
  const [showArchive, setShowArchive] = useState(false);
  const { uploadFonts, isFetching, isUploadingFonts, fonts } = useData();
  const nonArchivedFonts = useMemo(() => fonts.filter(f => !f.archived), [
    fonts,
  ]);
  const hasArchivedFonts = nonArchivedFonts.length < fonts.length;
  useEffect(() => {
    if (!hasArchivedFonts) {
      setShowArchive(false);
    }
  }, [setShowArchive, hasArchivedFonts]);
  return (
    <Card>
      <LineHeader
        icon={IconType.FONT}
        header={'Fonts'}
        onClick={() => setShowArchive(k => !k)}
        buttonLabel={(showArchive && 'Hide archived') || 'Show archived'}
        hideButton={!hasArchivedFonts}
      />

      <FileDrop
        title={'Upload new fonts'}
        onDrop={uploadFonts}
        isLoading={isUploadingFonts}
        mimeTypes={[
          '.otf',
          '.woff',
          '.woff2',
          '.eot',
          '.ttf',
          'application/vnd.ms-opentype',
          'application/vnd.ms-fontobject',
          'font/ttf',
          'font/woff',
          'font/woff2',
        ]}
      />

      <FileList
        files={showArchive ? fonts : nonArchivedFonts}
        isLoading={isFetching}
        onDelete={onDelete}
        onSelect={setSelected}
        selectedFile={selected}
      />
    </Card>
  );
};
