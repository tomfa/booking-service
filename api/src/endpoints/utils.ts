import * as Express from 'express';
import { JSONObject, FileDataDTO, utils } from '@pdf-generator/shared';
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
  const key = url.split(config.services.s3.endpointUrl).reverse()[0];
  return { ...utils.getFileDataFromKey(key, modified), url };
};

export const getFileDataFromKey = (
  key: string,
  modified?: string
): FileDataDTO => getFileDataFromUrl(getAbsoluteUrlFromKey(key), modified);

export const getAbsoluteUrlFromKey = (key: string) =>
  `${config.services.s3.endpointUrl}/${key}`;

export const getFileNameFromVariables = (
  variables: JSONObject,
  defaultName = 'file.pdf'
): string => {
  const filename = String(
    variables.filename || variables.title || variables.name || defaultName
  );
  if (filename.endsWith('.pdf')) {
    return filename;
  }
  return `${filename}.pdf`;
};
