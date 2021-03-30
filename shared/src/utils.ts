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

export const getFileDataFromUrl = (
  url: string,
  setModified = ''
): FileDataDTO => {
  const parts = removeQueryFromUrl(removeDomainFromUrl(url))
    .split('/')
    .filter(l => !!l);
  if (parts.length < 4) {
    throw new Error(
      `Can not construct FileDataDTO from unknown URL ${url}. Missing parts.`
    );
  }
  const owner = parts[0];
  const folder = FOLDER[parts[1]];
  const id = parts[2];
  let filename = parts[3];
  const archived = filename.endsWith('.archived');
  if (archived) {
    filename = filename.substring(0, filename.length - '.archived'.length);
  }

  return {
    url,
    owner,
    id,
    folder,
    filename,
    modified: setModified,
    archived,
  };
};
