import * as Express from 'express';
import { FOLDER } from '@pdf-generator/shared';
import { getUploadUrl, remove } from '../utils/files';
import { BadRequestError } from '../utils/errors/BadRequestError';
import { getData } from './utils';

export const getUploadURL = (prefix: FOLDER) => async (
  req: Express.Request,
  res: Express.Response
) => {
  const { name } = getData(req);
  if (!name) {
    throw new BadRequestError({ field: 'name', error: 'query param missing' });
  }
  const url = await getUploadUrl(prefix, String(name));
  return res.json({ message: 'OK', url });
};

const mapDataInputToStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  return [String(value)];
};

export const deleteFiles = (prefix: FOLDER) => async (
  req: Express.Request,
  res: Express.Response
) => {
  const { files, permanent } = getData(req);
  if (!files) {
    throw new BadRequestError({ field: 'files', error: 'query param missing' });
  }
  const allowedPermanantValues = ['1', '0', 'true', 'false'];
  if (!!permanent && !allowedPermanantValues.includes(permanent as string)) {
    throw new BadRequestError({
      field: 'permanent',
      error: `query param must be unset or one of ${allowedPermanantValues}`,
    });
  }

  const keys = mapDataInputToStringArray(files).map(key => `${prefix}/${key}`);

  if (['1', 'true'].includes(permanent as string)) {
    await remove({ keys });
  } else {
    await remove({ keys });
    // TODO FIX
    // await Promise.all(
    //   keys.map(key => {
    //     // TODO: Fix
    //     const archiveKey = '';
    //     return move(key, archiveKey);
    //   }),
    // );
  }
  return res.json({ data: keys, message: 'OK' });
};
