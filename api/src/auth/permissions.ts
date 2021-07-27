import config from '../config';
import { BadAuthenticationError } from '../utils/errors';
import { Auth, AuthTokenData, Role, ValueOf } from './types';

export const permissions = {
  // Superuser
  ALL: '*',
  ADD_CUSTOMER: 'customer:add',
  DELETE_CUSTOMER: 'customer:delete',
  GET_CUSTOMER: 'customer:get',
  UPDATE_CUSTOMER: 'customer:update',

  // Customer admin
  ADD_RESOURCE: 'resource:add',
  UPDATE_RESOURCE: 'resource:update',
  DELETE_RESOURCE: 'resource:delete',
  GET_ANY_BOOKING: 'booking:any:get',
  ADD_ANY_BOOKING: 'booking:any:add',
  SET_ANY_BOOKING_COMMENT: 'booking:own:update-comment',
  CANCEL_ANY_BOOKING: 'booking:any:cancel',

  // End user
  GET_RESOURCE: 'resource:get',
  GET_OWN_BOOKING: 'booking:own:get',
  ADD_OWN_BOOKING: 'booking:own:add',
  SET_OWN_BOOKING_COMMENT: 'booking:own:update-comment',
  CANCEL_OWN_BOOKING: 'booking:own:cancel',
  FIND_RESOURCE_AVAILABILITY: 'availability:get',
};

const userPerms = [
  permissions.GET_RESOURCE,
  permissions.GET_OWN_BOOKING,
  permissions.ADD_OWN_BOOKING,
  permissions.SET_OWN_BOOKING_COMMENT,
  permissions.CANCEL_OWN_BOOKING,
  permissions.FIND_RESOURCE_AVAILABILITY,
];

const adminPerms = [
  permissions.ADD_RESOURCE,
  permissions.UPDATE_RESOURCE,
  permissions.DELETE_RESOURCE,
  permissions.GET_ANY_BOOKING,
  permissions.ADD_ANY_BOOKING,
  permissions.SET_ANY_BOOKING_COMMENT,
  permissions.CANCEL_ANY_BOOKING,
];

const superuserPerms = [
  permissions.ALL,
  permissions.ADD_CUSTOMER,
  permissions.DELETE_CUSTOMER,
  permissions.GET_CUSTOMER,
  permissions.UPDATE_CUSTOMER,
];

export const removeSuperuserPermissions = (perms: Permission[]) => {
  return perms.filter(p => !superuserPerms.includes(p));
};

const getPermissionsForRole = (role: Role): Permission[] => {
  if (role === 'user') {
    return userPerms;
  }

  if (role === 'admin') {
    return userPerms.concat(adminPerms);
  }

  if (role === 'superuser') {
    return [permissions.ALL];
  }
  return [];
};

const getPermissionsStatedInToken = (token: AuthTokenData): Permission[] => {
  if (token.permissions && token.permissions.length) {
    return token.permissions;
  }
  if (token.role) {
    const perms = getPermissionsForRole(token.role);
    if (perms.length) {
      return perms;
    }
  }
  return getPermissionsForRole('user');
};

export const getPermissionsFromToken = (token: AuthTokenData): Permission[] => {
  const statedPermissions = getPermissionsStatedInToken(token);
  if (token.iss === config.jwt.issuer) {
    return statedPermissions;
  }
  return removeSuperuserPermissions(statedPermissions);
};

export type Permission = ValueOf<typeof permissions>;

export const addPermissionPrefixIfNeeded = (permission: string) => {
  const prefix = config.jwt.permissionPrefix;
  return permission.startsWith(prefix) ? permission : `${prefix}${permission}`;
};

const isPermissionGranted = ({
  allowedPermission,
  requestedPermission,
}: {
  allowedPermission: string;
  requestedPermission: Permission;
}): boolean => {
  const requested = addPermissionPrefixIfNeeded(requestedPermission);
  const allowed = addPermissionPrefixIfNeeded(allowedPermission);
  const matches = requested.match(allowed.replace('*', '(.*)'));
  return !!matches && matches.length > 0;
};

export function hasPermission(auth: Auth, permission: Permission): boolean {
  return !!auth.permissions.find(p =>
    isPermissionGranted({
      allowedPermission: p,
      requestedPermission: permission,
    })
  );
}

export function verifyPermission(auth: Auth, permission: Permission) {
  if (!hasPermission(auth, permission)) {
    throw new BadAuthenticationError(
      `You do not have the required access '${permission}'`
    );
  }
}
