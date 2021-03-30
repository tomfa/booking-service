import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { FileDataDTO, FOLDER } from '@pdf-generator/shared';
import * as api from '../api';

export type DataValues = {
  fetchData: () => Promise<void>;
  uploadFonts: (files: File[]) => Promise<void>;
  deleteFile: (file: FileDataDTO, permenant?: boolean) => Promise<void>;
  uploadTemplates: (files: File[]) => Promise<void>;
  fonts: FileDataDTO[];
  templates: FileDataDTO[];
  files: FileDataDTO[];
  archivedFonts: FileDataDTO[];
  archivedTemplates: FileDataDTO[];
  archivedFiles: FileDataDTO[];
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
  const [allFiles, setAllFiles] = useState<FileDataDTO[]>([]);
  const [allTemplates, setAllTemplates] = useState<FileDataDTO[]>([]);
  const [allFonts, setAllFonts] = useState<FileDataDTO[]>([]);
  const fonts = useMemo(() => allFonts.filter(f => !f.archived), [allFonts]);
  const archivedFonts = useMemo(() => allFonts.filter(f => f.archived), [
    allFonts,
  ]);
  const files = useMemo(() => allFiles.filter(f => !f.archived), [allFiles]);
  const archivedFiles = useMemo(() => allFiles.filter(f => f.archived), [
    allFiles,
  ]);
  const templates = useMemo(() => allTemplates.filter(f => !f.archived), [
    allTemplates,
  ]);
  const archivedTemplates = useMemo(
    () => allTemplates.filter(f => f.archived),
    [allTemplates]
  );

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    // TODO: Check if authenticated, handle errors
    const filesList = await api.listFiles(FOLDER.files);
    const fontsList = await api.listFiles(FOLDER.fonts);
    const templateList = await api.listFiles(FOLDER.templates);
    setAllFiles(filesList);
    setAllTemplates(templateList);
    setAllFonts(fontsList);
    setIsFetching(false);
  }, [setAllFiles, setIsFetching]);

  const deleteFile = useCallback(
    async (file: FileDataDTO, permanent = false) => {
      const type = file.folder;
      await api.deleteFile(file, permanent);
      if (type === FOLDER.files) {
        if (permanent) {
          setAllFiles(existing => existing.filter(f => f !== file));
        } else {
          setAllFiles(existing => [
            ...existing.filter(f => f !== file),
            { ...file, archived: true },
          ]);
        }
      }
      if (type === FOLDER.templates) {
        if (permanent) {
          setAllTemplates(existing => existing.filter(f => f !== file));
        } else {
          setAllTemplates(existing => [
            ...existing.filter(f => f !== file),
            { ...file, archived: true },
          ]);
        }
      }
      if (type === FOLDER.fonts) {
        if (permanent) {
          setAllFonts(existing => existing.filter(f => f !== file));
        } else {
          setAllFonts(existing => [
            ...existing.filter(f => f !== file),
            { ...file, archived: true },
          ]);
        }
      }
    },
    [setAllFonts, setAllFiles, setAllTemplates]
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
      setAllFonts(existing => [...newFiles, ...existing.filter(wasNotUpdated)]);
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
      setAllTemplates(existing => [
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
        archivedFonts,
        archivedFiles,
        archivedTemplates,
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
