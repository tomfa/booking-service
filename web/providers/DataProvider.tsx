import { createContext, useCallback, useContext, useState } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { uploadFile, listFiles } from '../api';

export type DataValues = {
  fetchData: () => Promise<void>;
  uploadFonts: (files: File[]) => Promise<void>;
  uploadTemplates: (files: File[]) => Promise<void>;
  fonts: FileDataDTO[];
  templates: FileDataDTO[];
  files: FileDataDTO[];
  isLoading: boolean;
  error: null | string;
};

export const DataContext = createContext<DataValues>(null);
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [files, setFiles] = useState<FileDataDTO[]>([]);
  const [templates, setTemplates] = useState<FileDataDTO[]>([]);
  const [fonts, setFonts] = useState<FileDataDTO[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    // TODO: Check if authenticated, handle errors
    const filesList = await listFiles('file');
    const fontsList = await listFiles('font');
    const templateList = await listFiles('template');
    setFiles(filesList);
    setTemplates(templateList);
    setFonts(fontsList);
    setIsLoading(false);
  }, [setFiles, setIsLoading]);

  const uploadFonts = useCallback(
    async (toUpload: File[]) => {
      setIsLoading(true);
      await Promise.all(toUpload.map((file) => uploadFile(file, 'font')));
      setIsLoading(false);
      // TODO: update folders
    },
    [setIsLoading],
  );

  const uploadTemplates = useCallback(
    async (toUpload: File[]) => {
      setIsLoading(true);
      await Promise.all(toUpload.map((file) => uploadFile(file, 'template')));
      setIsLoading(false);
      // TODO: update folders
    },
    [setIsLoading],
  );

  return (
    <DataContext.Provider
      value={{
        fetchData,
        fonts,
        files,
        templates,
        uploadFonts,
        uploadTemplates,
        error,
        isLoading,
      }}>
      {children}
    </DataContext.Provider>
  );
};
export const useData = (): DataValues => {
  return useContext(DataContext);
};
