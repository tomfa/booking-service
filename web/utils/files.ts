import { KeyedVariable } from '../providers/PDFProvider';

export const getFileNameFromVariables = (
  variables: KeyedVariable[]
): string | undefined => {
  const fileVariable =
    variables.find(k => k.label === 'filename') ||
    variables.find(k => k.label === 'title') ||
    variables.find(k => k.label === 'name');
  const filename = fileVariable && String(fileVariable.value);
  if (!filename) {
    return undefined;
  }
  if (filename.endsWith('.pdf')) {
    return filename;
  }
  return `${filename}.pdf`;
};
