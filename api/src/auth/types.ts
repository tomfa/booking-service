import { Permission } from './permissions';

export type Auth = {
  sub: null | string;
  customerId: string | null;
  permissions: Permission[];
};

export type Role = 'user' | 'admin' | 'superuser';

export type AuthTokenData = {
  iss: string;
  sub: string;
  permissions: string[];
  role?: Role;
};

export type User = {
  username: string;
};

export type UserWithPassword = {
  username: string;
  password: string;
};

export interface APITokenData {
  sub: string;
  iss: string;
  aud?: string[];
  exp: number;
  iat?: number;
  role?: Role;
  permissions: string[];
}

export interface TokenData extends APITokenData {
  aud: string[];
  role: Role;
}

export type ValueOf<T> = T[keyof T];
