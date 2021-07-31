import config from '../config';
import { TokenData } from '../auth/types';
import { sign } from '../auth/jwt';
import { addPermissionPrefixIfNeeded } from '../auth/permissions';

export const createJWTtoken = (
  username: string,
  permissions: string[] = ['api:*']
): string => {
  const data: Omit<TokenData, 'iat' | 'exp'> = {
    iss: config.jwt.issuer,
    aud: config.jwt.audience,
    sub: username,
    permissions: permissions.map(addPermissionPrefixIfNeeded),
    role: 'user',
  };
  return sign(data);
};
