import * as Express from 'express';
import { list } from '../../utils/files';
import { FOLDER } from '../enums';

export const listTemplates = async (
  req: Express.Request,
  res: Express.Response
) => {
  const templates = await list({ folder: FOLDER.templates });
  return res.json({ data: templates, message: 'OK' });
};
