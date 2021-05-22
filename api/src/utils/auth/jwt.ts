import * as jwt from 'jsonwebtoken';
import { JSONObject } from '@booking-service/shared';
import config from '../../config';

export function sign<T extends JSONObject>(payload: T): string {
  const token = jwt.sign(payload, config.jwt.secret);
  return token;
}

export function verify<T = JSONObject>(token: string): T {
  const data = jwt.verify(token, config.jwt.secret);
  return (data as unknown) as T;
}
