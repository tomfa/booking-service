import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FileDataDTO } from '@pdf-generator/shared';
import { config } from '../config';

export type PDFValues = {
  generatedUrl: string;
  selectedTemplate: null | FileDataDTO;
  setSelectedTemplate: (file: FileDataDTO | null) => void;
  clearVariables: () => void;
  updateVariable: (name: string, value: string) => void;
  variables: Record<string, string>;
  isLoading: boolean;
  error: null | string;
};

export const PDFContext = createContext<PDFValues>(null);
export const PDFProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<null | FileDataDTO>(
    null
  );
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error] = useState<string>('');

  const updateVariable = useCallback(
    (name: string, value: string | number) => {
      setVariables(existing => ({ ...existing, [name]: String(value) }));
    },
    [setVariables]
  );
  const clearVariables = useCallback(() => setVariables({}), [setVariables]);

  useEffect(() => {
    if (!selectedTemplate) {
      setGeneratedUrl('');
      return;
    }
    setIsLoading(true);
    // TODO: This is probably not very URL safe
    const urlVariables = Object.entries(variables)
      .map(([key, val]) => `${key}=${val}`)
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
        updateVariable,
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
