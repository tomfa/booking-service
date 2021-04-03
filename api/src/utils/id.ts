import * as uuid from 'uuid';
import config from '../config';
import { Variables } from '../types';

export function randomId() {
  return uuid.v4();
}

export const getDeterministicId = (keys: string[]): string => {
  return uuid.v5(keys.join(';'), config.uuidNameSpace);
};

export const generateFileId = ({
  userId,
  templateId,
  variables,
}: {
  userId: string;
  templateId: string;
  variables: Variables;
}): string => {
  const variableString = Object.entries(variables)
    .map(([k, v]) => `${k}=${v}`)
    .join(';');
  return getDeterministicId([userId, templateId, variableString]);
};
