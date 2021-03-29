import { createContext, useCallback, useContext, useState } from 'react';
import { FileDataDTO, FOLDER } from '@pdf-generator/shared';
import * as api from '../api';

export type DataValues = {
  fetchData: () => Promise<void>;
  uploadFonts: (files: File[]) => Promise<void>;
  deleteFile: (file: FileDataDTO) => Promise<void>;
  uploadTemplates: (files: File[]) => Promise<void>;
  fonts: FileDataDTO[];
  templates: FileDataDTO[];
  files: FileDataDTO[];
  isFetching: boolean;
  isUploadingTemplates: boolean;
  isUploadingFonts: boolean;
  error: null | string;
};

export const DataContext = createContext<DataValues>(null);
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isUploadingTemplates, setIsUploadingTemplates] = useState<boolean>(
    false
  );
  const [isUploadingFonts, setIsUploadingFonts] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error] = useState<string>('');
  const [files, setFiles] = useState<FileDataDTO[]>([]);
  const [templates, setTemplates] = useState<FileDataDTO[]>([]);
  const [fonts, setFonts] = useState<FileDataDTO[]>([]);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    // TODO: Check if authenticated, handle errors
    const filesList = await api.listFiles(FOLDER.files);
    const fontsList = await api.listFiles(FOLDER.fonts);
    const templateList = await api.listFiles(FOLDER.templates);
    setFiles(filesList);
    setTemplates(templateList);
    setFonts(fontsList);
    setIsFetching(false);
  }, [setFiles, setIsFetching]);

  const deleteFile = useCallback(
    async (file: FileDataDTO) => {
      const type = file.folder;
      await api.deleteFile(file);
      if (type === FOLDER.files) {
        setFiles(existing => existing.filter(f => f !== file));
      }
      if (type === FOLDER.templates) {
        setTemplates(existing => existing.filter(f => f !== file));
      }
      if (type === FOLDER.fonts) {
        setFonts(existing => existing.filter(f => f !== file));
      }
    },
    [setFonts, setFiles, setTemplates]
  );

  const uploadFonts = useCallback(
    async (toUpload: File[]) => {
      setIsUploadingFonts(true);
      const uploads = await Promise.all(
        toUpload.map(file => api.uploadFile(file, FOLDER.fonts))
      );
      const newFiles = uploads.map(u => u.data);
      const wasNotUpdated = (file: FileDataDTO) =>
        !newFiles.find(f => f.url === file.url);
      setFonts(existing => [...newFiles, ...existing.filter(wasNotUpdated)]);
      setIsUploadingFonts(false);
    },
    [setIsUploadingFonts]
  );

  const uploadTemplates = useCallback(
    async (toUpload: File[]) => {
      setIsUploadingTemplates(true);
      const uploads = await Promise.all(
        toUpload.map(file => api.uploadFile(file, FOLDER.templates))
      );
      const newFiles = uploads.map(u => u.data);
      const wasNotUpdated = (file: FileDataDTO) =>
        !newFiles.find(f => f.url === file.url);
      setTemplates(existing => [
        ...newFiles,
        ...existing.filter(wasNotUpdated),
      ]);
      setIsUploadingTemplates(false);
    },
    [setIsUploadingTemplates]
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
        isFetching,
        isUploadingFonts,
        isUploadingTemplates,
        deleteFile,
      }}>
      {children}
    </DataContext.Provider>
  );
};
export const useData = (): DataValues => {
  return useContext(DataContext);
};
