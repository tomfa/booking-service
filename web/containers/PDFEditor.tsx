import { useCallback, useEffect } from 'react';
import { FileDataDTO } from '@booking-service/shared';
import { Main } from '../components/Main.styles';
import { useData } from '../providers/DataProvider';
import { usePDFGenerator } from '../providers/PDFProvider';
import { MessageType, useMessage } from '../providers/MessageProvider';
import { Templates } from './Templates';
import { Generator } from './Generator';
import { Fonts } from './Fonts';
import { Files } from './Files';

export const PDFEditor = () => {
  const { fetchData, deleteFile } = useData();
  const { selectedTemplate, setSelectedTemplate } = usePDFGenerator();
  const { addMessage } = useMessage();

  const onDelete = useCallback(
    async (file: FileDataDTO) => {
      const permanentDelete = file.archived;
      const deleted = await deleteFile(file, permanentDelete);
      deleted &&
        addMessage({
          title: `${file.filename} was ${
            permanentDelete ? 'deleted' : 'archived'
          }`,
          type: MessageType.INFO,
        });
    },
    [deleteFile, addMessage]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <Main>
      <Templates
        onDelete={onDelete}
        onSelect={setSelectedTemplate}
        selected={selectedTemplate}
      />
      <Generator />

      <Files onDelete={onDelete} />
      <Fonts onDelete={onDelete} />
    </Main>
  );
};
