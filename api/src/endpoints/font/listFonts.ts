import * as Express from 'express';
import { list } from '../../utils/files';
import { FOLDER } from '../enums';

export const listFonts = async (
  req: Express.Request,
  res: Express.Response
) => {
  const fonts = await list({ folder: FOLDER.fonts });
  return res.json({ data: fonts, message: 'OK' });
};
