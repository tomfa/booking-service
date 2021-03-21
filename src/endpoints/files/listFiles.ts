import * as Express from 'express';
import { getFiles } from '../../utils/files';

export const listFiles = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const filesObjects = await getFiles({ keyPrefix: 'files/' });
  const files = filesObjects.map((file) => ({filename: file.filename, modified: file.modified.toISOString(), url: file.url }));
  return res.json({ files, message: 'OK' });
};
