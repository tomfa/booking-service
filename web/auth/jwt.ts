import * as jwt from 'jsonwebtoken';
import { TokenData } from './types';

export function sign<T extends string | Record<string, unknown>>(
  payload: T
): string {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '31 days',
  });
  return token;
}

export const createJWTtoken = (
  customerEmail: string,
  permissions: string[] = ['api:*']
): string => {
  const data: Omit<TokenData, 'iat' | 'exp' | 'role'> = {
    iss: process.env.JWT_ISSUER,
    aud: [process.env.JWT_AUDIENCE],
    sub: customerEmail,
    permissions: permissions.map(addPermissionPrefixIfNeeded),
  };
  return sign(data);
};

const addPermissionPrefixIfNeeded = (permission: string) => {
  const prefix = 'vailable:';
  return permission.startsWith(prefix) ? permission : `${prefix}${permission}`;
};
