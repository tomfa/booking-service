import { useEffect, useMemo, useState } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import Link from 'next/link';
import { FileDrop } from '../components/FileDrop';
import { FileList } from '../components/FileList/FileList';
import { useData } from '../providers/DataProvider';
import { LineHeader } from '../components/LineHeader';
import { Card } from '../components/Card.styles';
import { IconType } from '../components/Icon';

export const Templates = ({
  onDelete,
  onSelect,
  selected,
}: {
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
  } = useData();
  const nonArchivedFiles = useMemo(() => templates.filter(f => !f.archived), [
    templates,
  ]);
  const hasArchivedFiles = nonArchivedFiles.length < templates.length;

  useEffect(() => {
    if (!hasArchivedFiles) {
      setShowArchive(false);
    }
  }, [setShowArchive, hasArchivedFiles]);
  return (
    <Card>
      <LineHeader
        icon={IconType.DOCUMENT}
        header={'Templates'}
        onClick={() => setShowArchive(k => !k)}
        buttonLabel={(showArchive && 'Hide archived') || 'Show archived'}
        hideButton={!hasArchivedFiles}
      />

      <h3 style={{ marginTop: 0 }}>Upload an SVG or HTML template</h3>

      <p>
        SVG files can use any{' '}
        <Link href="fonts.googleapis.com/">Google Font</Link>. For other fonts,
        the template must be an HTML file, with fonts included with {`<link>`}{' '}
        or in {`<style>`}
      </p>

      <p>
        Text elements in SVG files must be of type <code>{`<Text>`}</code>, not{' '}
        <code>{`<Path>`}</code>{' '}
      </p>

      <FileDrop
        title={'Upload new template'}
        onDrop={uploadTemplates}
        isLoading={isUploadingTemplates}
        mimeTypes={['.svg', '.html', 'image/svg', 'text/html']}
      />
      <FileList
        files={showArchive ? templates : nonArchivedFiles}
        isLoading={isFetching}
        onSelect={onSelect}
        selectedFile={selected}
        onDelete={onDelete}
      />
    </Card>
  );
};
