import * as Express from 'express';
import { getFiles } from '../../utils/files';
import { mapToFileDataDTO } from '../utils';

export const listFiles = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const filesObjects = await getFiles({ keyPrefix: 'files/' });
  const files = filesObjects.map(mapToFileDataDTO);
  return res.json({ files, message: 'OK' });
};
