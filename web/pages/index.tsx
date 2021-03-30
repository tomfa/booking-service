import Head from 'next/head';
import { useCallback, useEffect } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { useAuth } from '../providers/AuthProvider';
import { useData } from '../providers/DataProvider';
import { usePDFGenerator } from '../providers/PDFProvider';
import { Generator } from '../containers/Generator';
import { MessageType, useMessage } from '../providers/MessageProvider';
import { Templates } from '../containers/Templates';
import { Fonts } from '../containers/Fonts';
import { Files } from '../containers/Files';
import { H1 } from '../components/H1.styles';
import { PageWrapper } from '../components/PageWrapper.styles';
import { Main } from '../components/Main.styles';

export default function Home() {
  const auth = useAuth();
  const { fetchData, deleteFile } = useData();
  const { selectedTemplate, setSelectedTemplate } = usePDFGenerator();
  const { addMessage } = useMessage();
  const onArchive = useCallback(
    async (file: FileDataDTO) => {
      const deleted = await deleteFile(file, false);
      deleted &&
        addMessage({
          title: `${file.filename} was archived.`,
          type: MessageType.INFO,
        });
    },
    [deleteFile, addMessage]
  );
  const onDelete = useCallback(
    async (file: FileDataDTO) => {
      const deleted = await deleteFile(file, true);
      deleted &&
        addMessage({
          title: `${file.filename} was deleted`,
          type: MessageType.INFO,
        });
    },
    [deleteFile, addMessage]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <>
      <Head>
        <title>PDF Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageWrapper>
        <Main>
          <H1>PDF generator {auth.username}</H1>

          <Templates
            onDelete={onDelete}
            onArchive={onArchive}
            onSelect={setSelectedTemplate}
            selected={selectedTemplate}
          />
          <Generator />

          <Fonts onArchive={onArchive} onDelete={onDelete} />
          <Files onArchive={onArchive} onDelete={onDelete} />
        </Main>
      </PageWrapper>
    </>
  );
}
