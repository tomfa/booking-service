import * as Express from 'express';
import { JSONObject, FileDataDTO } from '@pdf-generator/shared';
import { FileData } from '../types';

export const getData = (req: Express.Request): JSONObject => {
  if (req.method === 'GET') {
    return req.query as Record<string, string | string[]>;
  }
  return (req.body || {}) as JSONObject;
};

export const mapToFileDataDTO = (file: FileData): FileDataDTO => ({
  filename: file.filename,
  modified: file.modified.toISOString(),
  url: file.url,
});
