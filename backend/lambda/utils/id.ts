import * as uuid from 'uuid';
import config from '../config';

export function randomId() {
  return uuid.v4();
}

export const getDeterministicId = (keys: string[]): string => {
  return uuid.v5(keys.join(';'), config.uuidNameSpace);
};
