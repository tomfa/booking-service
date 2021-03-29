import * as Express from 'express';
import { FOLDER } from '@pdf-generator/shared';
import { list } from '../../utils/files';
import { getUser } from '../../utils/auth/utils';

export const listFonts = async (
  req: Express.Request,
  res: Express.Response
) => {
  const owner = getUser(req).username;
  const fonts = await list({ folder: FOLDER.fonts, owner });
  return res.json({ data: fonts, message: 'OK' });
};
