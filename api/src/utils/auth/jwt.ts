import * as jwt from 'jsonwebtoken';
import { JSONObject } from '@pdf-generator/shared';
import config from '../../config';

export const sign = (payload: JSONObject): string => {
  const token = jwt.sign(payload, config.jwtSecret);
  return token;
};

export const verify = (token: string): JSONObject => {
  const data = jwt.verify(token, config.jwtSecret);
  return data as JSONObject;
};
