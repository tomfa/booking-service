import { UserWithTokenData } from '../auth/types';
import config from '../config';
import { createJWTtoken } from './token';
import { BadAuthenticationError } from './errors';

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
    throw new BadAuthenticationError(`Wrong username or password`);
  }
  return {
    username: user.username,
    jwt: createJWTtoken(username),
  };
};
