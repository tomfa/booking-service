import config from '../../config';
import { BadAuthenticationError } from '../errors/BadAuthenticatedError';
import { UserWithTokenData } from './types';
import { createApiKey, createJWTtoken } from './token';

export const findUserAuthData = ({
  username,
  password,
}: {
  username: string;
  password: string;
}): UserWithTokenData | undefined => {
  const user = config.users.find(
    u => u.username === username && u.password === password
  );
  if (!user) {
    throw new BadAuthenticationError();
  }
  return {
    username: user.username,
    jwt: createJWTtoken(username),
    apiKey: createApiKey(username),
  };
};
