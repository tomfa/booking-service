export type Role = 'user';

export type Auth = {
  isExpired: boolean;
  username: string;
  permissions: string[];
  role: Role;
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
  permissions: string[];
}

export interface TokenData extends APITokenData {
  aud: string[];
  role: Role;
}

export type UserWithTokenData = User & { apiKey: string; jwt: string };
