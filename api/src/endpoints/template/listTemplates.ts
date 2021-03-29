import * as Express from 'express';
import { FOLDER } from '@pdf-generator/shared';
import { list } from '../../utils/files';

export const listTemplates = async (
  req: Express.Request,
  res: Express.Response
) => {
  const templates = await list({ folder: FOLDER.templates });
  return res.json({ data: templates, message: 'OK' });
};
