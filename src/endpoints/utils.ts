import * as Express from 'express';
import { FileData, FileDataDTO, JSONObject } from '../types';

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
