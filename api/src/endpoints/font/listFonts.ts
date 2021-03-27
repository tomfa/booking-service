import * as Express from 'express';
import { getFiles } from '../../utils/files';
import { mapToFileDataDTO } from '../utils';
import { FOLDER } from '../enums';

export const listFonts = async (
  req: Express.Request,
  res: Express.Response
) => {
  const files = await getFiles({ folder: FOLDER.fonts });
  const fonts = files.map(mapToFileDataDTO);
  return res.json({ data: fonts, message: 'OK' });
};
