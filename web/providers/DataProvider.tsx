import { createContext, useCallback, useContext } from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import uploadFile from '../api/upload';

type DataValues = {
  fonts: FileDataDTO[];
  templates: FileDataDTO[];
  files: FileDataDTO[];
  isLoading: boolean;
  error: null | string;
};
export type UseDataValues = {
  uploadFonts: (files: File[]) => Promise<boolean>;
  uploadTemplates: (files: File[]) => Promise<boolean>;
  fonts: FileDataDTO[];
  templates: FileDataDTO[];
  files: FileDataDTO[];
  isLoading: boolean;
  error: null | string;
};
const defaultValues: DataValues = {
  fonts: [],
  templates: [],
  files: [],
  isLoading: false,
  error: null,
};

export const DataContext = createContext<DataValues>(defaultValues);
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DataContext.Provider value={defaultValues}>
      {children}
    </DataContext.Provider>
  );
};
export const useData = (): UseDataValues => {
  const context = useContext(DataContext);
  const uploadFonts = useCallback(
    async (files: File[]) => {
      context.isLoading = true;
      await Promise.all(files.map((file) => uploadFile(file, 'font')));
      context.isLoading = false;
      // TODO: return FileDataDTO?
      return true;
    },
    [context]
  );

  const uploadTemplates = useCallback(
    async (files: File[]) => {
      context.isLoading = true;
      await Promise.all(files.map((file) => uploadFile(file, 'template')));
      context.isLoading = false;
      // TODO: return FileDataDTO?
      return true;
    },
    [context]
  );

  return {
    fonts: context.fonts,
    files: context.files,
    templates: context.templates,
    uploadFonts,
    uploadTemplates,
    error: context.error,
    isLoading: context.isLoading,
  };
};
