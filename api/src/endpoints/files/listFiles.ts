import * as Express from 'express';
import { getFiles } from '../../utils/files';
import { mapToFileDataDTO } from '../utils';
import { FOLDER } from '../enums';

export const listFiles = async (
  req: Express.Request,
  res: Express.Response
) => {
  const filesObjects = await getFiles({ folder: FOLDER.files });
  const files = filesObjects.map(mapToFileDataDTO);
  return res.json({ data: files, message: 'OK' });
};
