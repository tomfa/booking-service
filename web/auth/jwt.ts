import * as jwt from 'jsonwebtoken';
import { TokenData } from './types';

export function sign<T extends string | Record<string, unknown>>(
  payload: T
): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(`env.JWT_SECRET is not set`);
  }
  const token = jwt.sign(payload, secret, {
    expiresIn: '31 days',
  });
  return token;
}

export const createJWTtoken = (
  customerEmail: string,
  permissions: string[] = ['api:*']
): string => {
  const iss = process.env.JWT_ISSUER;
  if (!iss) {
    throw new Error(`env.JWT_ISSUER is not set`);
  }
  const aud = process.env.JWT_AUDIENCE;
  if (!aud) {
    throw new Error(`env.JWT_AUDIENCE is not set`);
  }

  const data: Omit<TokenData, 'iat' | 'exp' | 'role'> = {
    iss,
    aud: [aud],
    sub: customerEmail,
    permissions: permissions.map(addPermissionPrefixIfNeeded),
  };
  return sign(data);
};

const addPermissionPrefixIfNeeded = (permission: string) => {
  const prefix = 'vailable:';
  return permission.startsWith(prefix) ? permission : `${prefix}${permission}`;
};
