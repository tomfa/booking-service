import * as Express from 'express';
import { JSONObject, FileDataDTO } from '@pdf-generator/shared';
import { FileData } from '../types';

export const getData = (req: Express.Request): JSONObject => {
  if (req.method === 'POST') {
    return (req.body || {}) as JSONObject;
  }
  return req.query as Record<string, string | string[]>;
};

export const mapToFileDataDTO = (file: FileData): FileDataDTO => ({
  filename: file.filename,
  modified: file.modified.toISOString(),
  url: file.url,
});
