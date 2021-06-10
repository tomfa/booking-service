import { encodeUrlSafeBase64 } from '../base64';
import config from '../../config';
import { sign, verify } from './jwt';
import { Auth, TokenData } from './types';

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

export const createApiKey = (
  username: string,
  permissions: string[] = ['api:generate:from_template']
): string => {
  const token = createJWTtoken(username, permissions);
  const apiKey = encodeUrlSafeBase64(token);
  return apiKey;
};

export async function getAuth(key: string): Promise<Auth> {
  const data = await verify(key);
  return {
    username: data.sub,
    role: data.role,
    isExpired: false,
    permissions: data.permissions,
  };
}

export const addPermissionPrefixIfNeeded = (permission: string) => {
  const prefix = config.jwt.permissionPrefix;
  return permission.startsWith(prefix) ? permission : `${prefix}${permission}`;
};

const isPermissionGranted = ({
  allowedPermission,
  requestedPermission,
}: {
  allowedPermission: string;
  requestedPermission: string;
}): boolean => {
  const requested = addPermissionPrefixIfNeeded(requestedPermission);
  const allowed = addPermissionPrefixIfNeeded(allowedPermission);
  return requested.match(allowed.replace('*', '(.*)')).length > 0;
};

export function hasPermission(auth: Auth, permission: string): boolean {
  return !!auth.permissions.find(p =>
    isPermissionGranted({
      allowedPermission: p,
      requestedPermission: permission,
    })
  );
}
