import * as Express from 'express';
import { getUploadUrl } from '../utils/files';
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
