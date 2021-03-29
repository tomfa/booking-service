import * as Express from 'express';
import { FOLDER } from '@pdf-generator/shared';
import { list } from '../../utils/files';
import { getUser } from '../../utils/auth/utils';

export const listFiles = async (
  req: Express.Request,
  res: Express.Response
) => {
  const owner = getUser(req).username;
  const files = await list({ folder: FOLDER.files, owner });
  return res.json({ data: files, message: 'OK' });
};
