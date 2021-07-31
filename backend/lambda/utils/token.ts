import config from '../config';
import { Auth, TokenData } from '../auth/types';
import { sign, verify } from '../auth/jwt';

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
  const matches = requested.match(allowed.replace('*', '(.*)'));
  return !!matches && matches.length > 0;
};

export function hasPermission(auth: Auth, permission: string): boolean {
  return !!auth.permissions.find(p =>
    isPermissionGranted({
      allowedPermission: p,
      requestedPermission: permission,
    })
  );
}
