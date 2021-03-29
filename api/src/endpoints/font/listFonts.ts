import * as Express from 'express';
import { FOLDER } from '@pdf-generator/shared';
import { list } from '../../utils/files';

export const listFonts = async (
  req: Express.Request,
  res: Express.Response
) => {
  const fonts = await list({ folder: FOLDER.fonts });
  return res.json({ data: fonts, message: 'OK' });
};
