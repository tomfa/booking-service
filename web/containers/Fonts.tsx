import { useEffect, useMemo, useState } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { FileDrop } from '../components/FileDrop';
import { FileList } from '../components/FileList/FileList';
import { useData } from '../providers/DataProvider';
import { LineHeader } from '../components/LineHeader';
import { Card } from '../components/Card.styles';
import { IconType } from '../components/Icon';
import { Code } from '../components/Code.styles';

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
  const fontCSS = useMemo(() => {
    const fontFamily = selected?.filename.split('.')[0] || 'select-a-font';
    const fontUrl = selected?.url || 'https://select-font-to-see-real-url.com';
    const fileEnding = fontUrl.split('.').reverse()[0];
    const format =
      (fileEnding === 'eot' && 'embedded-opentype') ||
      (fileEnding === 'ttf' && 'truetype') ||
      (fileEnding === 'otf' && 'opentype') ||
      fileEnding;
    return `<style>
  @font-face {
    font-family: '${fontFamily}';
    src: url('${fontUrl}') format('${format}');
  }
</style>
`;
  }, [selected]);
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

      <p>
        Fonts uploaded here are <em>not automatically inserted</em> into any SVG
        or HTML templates.
      </p>
      <p>
        You can upload fonts here for hosting, and refer to them from your HTML
        template by adding the code below.
      </p>
      <pre>
        <Code style={{ marginBottom: '1rem', overflowX: 'auto' }}>
          {fontCSS}
        </Code>
      </pre>

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
