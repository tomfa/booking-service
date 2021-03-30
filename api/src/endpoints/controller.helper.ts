import * as Express from 'express';
import { FOLDER } from '@pdf-generator/shared';
import { getUploadUrl, move, remove } from '../utils/files';
import { BadRequestError } from '../utils/errors/BadRequestError';
import { getUser } from '../utils/auth/utils';
import { getData, getFileDataFromKey } from './utils';

export const getUploadURL = (folder: FOLDER) => async (
  req: Express.Request,
  res: Express.Response
) => {
  const { name } = getData(req);
  const owner = getUser(req);
  if (!name) {
    throw new BadRequestError({ field: 'name', error: 'query param missing' });
  }
  const data = await getUploadUrl({
    folder,
    owner: owner.username,
    filename: String(name),
  });
  return res.json({ message: 'OK', url: data.url });
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
  const owner = getUser(req);
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

  const keys = mapDataInputToStringArray(files).map(
    key => `${owner.username}/${prefix}/${key}`
  );

  let data = [];
  if (['1', 'true'].includes(permanent as string)) {
    await remove({ keys });
  } else {
    await Promise.all(
      keys.map(key => {
        if (key.endsWith('.archived')) {
          return;
        }
        const archiveKey = `${key}.archived`;
        return move(key, archiveKey);
      })
    );
    data = keys.map(k => ({ ...getFileDataFromKey(k), archived: true }));
  }
  return res.json({ data, message: 'OK' });
};
