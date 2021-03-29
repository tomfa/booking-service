import * as Express from 'express';
import { JSONObject, FileDataDTO } from '@pdf-generator/shared';
import config from '../config';

export const getData = (req: Express.Request): JSONObject => {
  if (req.method === 'POST') {
    return (req.body || {}) as JSONObject;
  }
  return req.query as Record<string, string | string[]>;
};

export const getFileDataFromUrl = (url: string, modified = ''): FileDataDTO => {
  if (!url.includes(`${config.services.s3.endpointUrl}/`)) {
    throw new Error(`Can not construct FileDataDTO from unknown URL ${url}`);
  }
  const parts = url
    .split(config.services.s3.endpointUrl)[1]
    .split('/')
    .filter(l => !!l);
  if (parts.length < 4) {
    throw new Error(`Can not construct FileDataDTO from unknown URL ${url}`);
  }
  const folder = parts[0];
  const owner = parts[1];
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
    modified,
    archived,
  };
};

export const getFileDataFromKey = (
  key: string,
  modified?: string,
): FileDataDTO => getFileDataFromUrl(getAbsoluteUrlFromKey(key), modified);

export const getKeyFromData = (file: Omit<FileDataDTO, 'url'>): string => {
  const key = `${file.folder}/${file.owner}/${file.id}/${file.filename}`;
  if (!file.archived) {
    return key;
  }
  return `${key}.archived`;
};

export const getAbsoluteUrlFromKey = (key: string) =>
  `${config.services.s3.endpointUrl}/${key}`;
