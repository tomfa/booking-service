export type Role = 'user' | 'admin' | 'superuser';

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
