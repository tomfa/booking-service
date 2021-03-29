import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { config } from '../config';

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
        setVariables(existing => [
          { key, label, value },
          ...existing.filter(item => key !== item.key),
        ]);
      } else {
        setVariables(existing => existing.filter(item => key !== item.key));
      }
    },
    [setVariables]
  );
  const clearVariables = useCallback(() => setVariables([]), [setVariables]);

  useEffect(() => {
    if (!selectedTemplate) {
      setGeneratedUrl('');
      return;
    }
    setIsLoading(true);
    // TODO: This is probably not very URL safe
    const urlVariables = variables
      .map(({ label, value }) => `${label}=${value}`)
      .join('&');
    const url = `${config.API_URL}/generate/from_template?name=${selectedTemplate.filename}`;
    setGeneratedUrl(urlVariables ? `${url}&${urlVariables}` : url);
    setIsLoading(false);
  }, [selectedTemplate, variables, setGeneratedUrl]);

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