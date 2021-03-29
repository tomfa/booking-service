import * as Express from 'express';
import { list } from '../../utils/files';
import { mapToFileDataDTO } from '../utils';
import { FOLDER } from '../enums';

export const listTemplates = async (
  req: Express.Request,
  res: Express.Response
) => {
  const files = await list({ folder: FOLDER.templates });
  const templates = files.map(mapToFileDataDTO);
  return res.json({ data: templates, message: 'OK' });
};
