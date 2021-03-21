import * as Express from 'express';
import { getFiles } from '../../utils/files';

export const listTemplates = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const files = await getFiles({ keyPrefix: 'templates/' });
  const templates = files.map((file) => file.filename);
  return res.json({ templates, message: 'OK' });
};
