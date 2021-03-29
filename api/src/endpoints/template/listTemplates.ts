import * as Express from 'express';
import { FOLDER } from '@pdf-generator/shared';
import { list } from '../../utils/files';
import { getUser } from '../../utils/auth/utils';

export const listTemplates = async (
  req: Express.Request,
  res: Express.Response
) => {
  const owner = getUser(req).username;
  const templates = await list({ folder: FOLDER.templates, owner });
  return res.json({ data: templates, message: 'OK' });
};
