import * as Express from 'express';
import { list } from '../../utils/files';
import { FOLDER } from '../enums';

export const listFiles = async (
  req: Express.Request,
  res: Express.Response
) => {
  const files = await list({ folder: FOLDER.files });
  return res.json({ data: files, message: 'OK' });
};
