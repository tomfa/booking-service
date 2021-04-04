import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { config } from '../config';
import { useAuth } from './AuthProvider';

export type KeyedVariable = {
  key: number;
  label: string;
  value: string | number;
};
export type AddVariableFunc = (label: string, value: string) => void;
export type UpdateVariableFunc = (
  key: number,
  opt: { label: string; value: string | number | null }
) => void;
export type PDFValues = {
  generatedUrl: string;
  selectedTemplate: null | FileDataDTO;
  setSelectedTemplate: (file: FileDataDTO | null) => void;
  clearVariables: () => void;
  addVariable: AddVariableFunc;
  updateVariable: UpdateVariableFunc;
  setVariables: React.Dispatch<React.SetStateAction<KeyedVariable[]>>;
  variables: KeyedVariable[];
  isLoading: boolean;
  error: null | string;
};

export const PDFContext = createContext<PDFValues>(null);
export const PDFProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<null | FileDataDTO>(
    null
  );
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [variables, setVariables] = useState<KeyedVariable[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error] = useState<string>('');
  const auth = useAuth();

  const addVariable = useCallback(
    (label: string, value: string) => {
      setVariables(existing => {
        const maxKey = existing.length
          ? Math.max(...existing.map(i => i.key))
          : 0;
        return [{ key: maxKey + 1, label, value }, ...existing];
      });
    },
    [setVariables]
  );
  const updateVariable = useCallback(
    (
      key: number,
      { label, value }: { label: string; value: string | number | null }
    ) => {
      if (value !== null) {
        setVariables(existing =>
          existing.map(item =>
            item.key === key ? { key, label, value } : item
          )
        );
      } else {
        setVariables(existing => existing.filter(item => key !== item.key));
      }
    },
    [setVariables]
  );
  const clearVariables = useCallback(() => setVariables([]), [setVariables]);

  useEffect(() => {
    if (!selectedTemplate || !auth.isLoggedIn) {
      setGeneratedUrl('');
      return;
    }
    setIsLoading(true);
    const urlVariables = variables
      .map(
        ({ label, value }) =>
          `${encodeURIComponent(label)}=${encodeURIComponent(value)}`
      )
      .join('&');
    const url = `${config.API_URL}/generate/from_template?template=${selectedTemplate.filename}`;
    const boringVariables = `_id=${selectedTemplate.id}&token=${auth.apiKey}`;
    setGeneratedUrl(
      urlVariables
        ? `${url}&${urlVariables}&${boringVariables}`
        : `${url}&${boringVariables}`
    );
    setIsLoading(false);
  }, [
    selectedTemplate,
    variables,
    setGeneratedUrl,
    auth.apiKey,
    auth.isLoggedIn,
  ]);

  return (
    <PDFContext.Provider
      value={{
        variables,
        error,
        generatedUrl,
        addVariable,
        updateVariable,
        setVariables,
        clearVariables,
        isLoading,
        selectedTemplate,
        setSelectedTemplate,
      }}>
      {children}
    </PDFContext.Provider>
  );
};
export const usePDFGenerator = (): PDFValues => {
  return useContext(PDFContext);
};
