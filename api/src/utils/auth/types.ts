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

export type TokenData = {
  iss: string;
  aud: string[];
  iat: number;
  sub: string;
  permissions: string[];
  role: Role;
};

export type APITokenData = {
  iss: string;
  aud?: string[];
  exp?: number;
  permissions: string[];
};

export type UserWithTokenData = User & { apiKey: string; jwt: string };
