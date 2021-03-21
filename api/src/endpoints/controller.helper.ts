import * as Express from 'express';
import { getUploadUrl } from '../utils/files';
import { BadRequestError } from '../utils/errors/BadRequestError';
import { getData } from './utils';

export const getUploadURL = (prefix: string) => async (
  req: Express.Request,
  res: Express.Response
) => {
  const { name } = getData(req);
  if (!name) {
    throw new BadRequestError({ field: 'name', error: 'query param missing' });
  }
  const key = `${prefix}/${name}`;
  const url = await getUploadUrl(key);
  return res.json({ message: 'OK', url });
};
