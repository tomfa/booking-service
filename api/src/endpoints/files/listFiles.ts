import * as Express from 'express';
import { list } from '../../utils/files';
import { mapToFileDataDTO } from '../utils';
import { FOLDER } from '../enums';

export const listFiles = async (
  req: Express.Request,
  res: Express.Response
) => {
  const filesObjects = await list({ folder: FOLDER.files });
  const files = filesObjects.map(mapToFileDataDTO);
  return res.json({ data: files, message: 'OK' });
};
