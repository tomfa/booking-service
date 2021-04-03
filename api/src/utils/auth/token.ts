import { encodeUrlSafeBase64 } from '../base64';
import { BadAuthenticationError } from '../errors/BadAuthenticatedError';
import config from '../../config';
import { sign, verify } from './jwt';
import { Auth, TokenData } from './types';

export const createJWTtoken = (
  username: string,
  permissions: string[] = ['api:*']
): string => {
  return sign<Omit<TokenData, 'iat'>>({
    iss: config.jwt.issuer,
    aud: config.jwt.audience,
    sub: username,
    permissions,
    role: 'user',
  });
};

export const createApiKey = (username: string): string => {
  const token = createJWTtoken(username, ['api:generate:from_template']);
  const apiKey = encodeUrlSafeBase64(token);
  return apiKey;
};

export const getAuth = (key: string): Auth => {
  try {
    const data = verify<TokenData>(key);
    return {
      username: data.sub,
      role: data.role,
      isExpired: false,
      permissions: data.permissions,
    };
  } catch (err) {
    throw new BadAuthenticationError('Invalid JWT token');
  }
};

const isPermissionGranted = ({
  allowedPermission,
  requestedPermission,
}: {
  allowedPermission: string;
  requestedPermission: string;
}): boolean => {
  return (
    requestedPermission.match(allowedPermission.replace('*', '(.*)')).length > 0
  );
};

export const hasPermission = (auth: Auth, permission: string): boolean => {
  return !!auth.permissions.find(p =>
    isPermissionGranted({
      allowedPermission: p,
      requestedPermission: permission,
    })
  );
};
