import * as Express from 'express';
import { FOLDER } from '@pdf-generator/shared';
import { list } from '../../utils/files';

export const listFiles = async (
  req: Express.Request,
  res: Express.Response
) => {
  const files = await list({ folder: FOLDER.files });
  return res.json({ data: files, message: 'OK' });
};
