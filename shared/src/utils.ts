import { FileDataDTO, FOLDER } from './types';

export const removeDomainFromUrl = (url: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [domain, ...rest] = url.split('://').reverse()[0].split('/');
  if (!rest) {
    return '';
  }
  return rest.join('/');
};

export const removeQueryFromUrl = (url: string) => {
  return url.split('?')[0];
};

export const getKeyFromData = (file: Omit<FileDataDTO, 'url'>): string => {
  const key = `${file.owner}/${file.folder}/${file.id}/${file.filename}`;
  if (!file.archived) {
    return key;
  }
  return `${key}.archived`;
};

export const getFileDataFromKey = (
  key: string,
  setModified = ''
): Omit<FileDataDTO, 'url'> => {
  const parts = key
    .split('/')
    .filter(l => !!l)
    .reverse();
  if (parts.length < 4) {
    throw new Error(
      `Can not construct FileDataDTO from unknown key ${key}. Missing parts.`
    );
  }
  const owner = parts[3];
  const folder = FOLDER[parts[2]];
  const id = parts[1];
  let filename = parts[0];
  const archived = filename.endsWith('.archived');
  if (archived) {
    filename = filename.substring(0, filename.length - '.archived'.length);
  }

  return {
    owner,
    id,
    folder,
    filename,
    modified: setModified,
    archived,
  };
};

export const getFileDataFromUrl = (
  url: string,
  setModified = ''
): FileDataDTO => {
  const key = removeQueryFromUrl(removeDomainFromUrl(url));
  return { ...getFileDataFromKey(key, setModified), url };
};
