import * as Express from 'express';
import { getFiles } from '../../utils/files';
import { mapToFileDataDTO } from '../utils';

export const listTemplates = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const files = await getFiles({ keyPrefix: 'templates/' });
  const templates = files.map(mapToFileDataDTO);
  return res.json({ templates, message: 'OK' });
};
