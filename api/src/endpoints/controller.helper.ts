import * as Express from 'express';
import { getUploadUrl, remove } from '../utils/files';
import { BadRequestError } from '../utils/errors/BadRequestError';
import { getData } from './utils';
import { FOLDER } from './enums';

export const getUploadURL = (prefix: FOLDER) => async (
  req: Express.Request,
  res: Express.Response
) => {
  const { name } = getData(req);
  if (!name) {
    throw new BadRequestError({ field: 'name', error: 'query param missing' });
  }
  const url = await getUploadUrl(prefix, String(name));
  return res.json({ message: 'OK', url });
};

const mapDataInputToStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  return [String(value)];
};

export const deleteFiles = (prefix: FOLDER) => async (
  req: Express.Request,
  res: Express.Response
) => {
  const { files } = getData(req);
  if (!files) {
    throw new BadRequestError({ field: 'files', error: 'query param missing' });
  }
  // eslint-disable-next-line no-console
  console.log('deleting files', typeof files, files);

  const keys = mapDataInputToStringArray(files).map(key => `${prefix}/${key}`);

  await remove({ keys });
  return res.json({ data: keys, message: 'OK' });
};
