import * as Express from 'express';
import { JSONObject, FileDataDTO, utils } from '@booking-service/shared';
import config from '../config';

export const getData = (req: Express.Request): JSONObject => {
  if (req.method.toUpperCase() === 'POST') {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { token, ...data } = (req.body || {}) as JSONObject;
    return data;
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { token, ...data } = req.query as Record<string, string | string[]>;
  return data;
};

export const getFileDataFromUrl = (url: string, modified = ''): FileDataDTO => {
  if (!url.includes(`${config.services.s3.endpointUrl}/`)) {
    throw new Error(`Can not construct FileDataDTO from unknown URL ${url}`);
  }
  const key = url.split(config.services.s3.endpointUrl).reverse()[0];
  return {
    ...utils.getFileDataFromKey(key, modified),
    url: utils.removeQueryFromUrl(url),
  };
};

export const getFileDataFromKey = (
  key: string,
  modified?: string
): FileDataDTO => getFileDataFromUrl(getAbsoluteUrlFromKey(key), modified);

export const getAbsoluteUrlFromKey = (key: string) =>
  `${config.services.s3.endpointUrl}/${key}`;
