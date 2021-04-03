import { createContext, useCallback, useContext, useState } from 'react';
import { FileDataDTO, FOLDER } from '@pdf-generator/shared';
import * as api from '../api';
import { useAuth } from './AuthProvider';

export type DataValues = {
  fetchData: () => Promise<void>;
  uploadFonts: (files: File[]) => Promise<void>;
  deleteFile: (file: FileDataDTO, permenant?: boolean) => Promise<boolean>;
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
  const auth = useAuth();

  const fetchData = useCallback(async () => {
    if (!auth.jwtToken) {
      return;
    }
    setIsFetching(true);
    // TODO: Check if authenticated, handle errors
    const filesList = await api.listFiles(FOLDER.files, auth.jwtToken);
    const fontsList = await api.listFiles(FOLDER.fonts, auth.jwtToken);
    const templateList = await api.listFiles(FOLDER.templates, auth.jwtToken);
    setFiles(filesList);
    setTemplates(templateList);
    setFonts(fontsList);
    setIsFetching(false);
  }, [setFiles, setIsFetching, auth.jwtToken]);

  const deleteFile = useCallback(
    async (file: FileDataDTO, permanent = false) => {
      const type = file.folder;
      if (!permanent && file.archived) {
        // File is already archived
        return false;
      }
      await api.deleteFile(file, permanent, auth.jwtToken);
      if (type === FOLDER.files) {
        if (permanent) {
          setFiles(existing => existing.filter(f => f.id !== file.id));
        } else if (!file.archived) {
          setFiles(existing => [
            ...existing.filter(f => f.id !== file.id),
            { ...file, filename: file.filename, archived: true },
          ]);
        }
      }
      if (type === FOLDER.templates) {
        if (permanent) {
          setTemplates(existing => existing.filter(f => f.id !== file.id));
        } else if (!file.archived) {
          setTemplates(existing => [
            ...existing.filter(f => f.id !== file.id),
            { ...file, filename: file.filename, archived: true },
          ]);
        }
      }
      if (type === FOLDER.fonts) {
        if (permanent) {
          setFonts(existing => existing.filter(f => f.id !== file.id));
        } else if (!file.archived) {
          setFonts(existing => [
            ...existing.filter(f => f.id !== file.id),
            { ...file, filename: file.filename, archived: true },
          ]);
        }
      }
      return true;
    },
    [setFonts, setFiles, setTemplates, auth.jwtToken]
  );

  const uploadFonts = useCallback(
    async (toUpload: File[]) => {
      setIsUploadingFonts(true);
      const uploads = await Promise.all(
        toUpload.map(file => api.uploadFile(file, FOLDER.fonts, auth.jwtToken))
      );
      const newFiles = uploads.map(u => u.data);
      const wasNotUpdated = (file: FileDataDTO) =>
        !newFiles.find(f => f.url === file.url);
      setFonts(existing => [...newFiles, ...existing.filter(wasNotUpdated)]);
      setIsUploadingFonts(false);
    },
    [setIsUploadingFonts, auth.jwtToken]
  );

  const uploadTemplates = useCallback(
    async (toUpload: File[]) => {
      setIsUploadingTemplates(true);
      const uploads = await Promise.all(
        toUpload.map(file =>
          api.uploadFile(file, FOLDER.templates, auth.jwtToken)
        )
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
    [setIsUploadingTemplates, auth.jwtToken]
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
