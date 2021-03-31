import config from '../../config';
import { User, UserAuthData } from './types';

export const getUserAPITokens = (user: User): string[] => {
  const authData = config.users.find(u => u.username === user.username);
  if (!authData) {
    throw new Error(
      `Unexpected error: Unable to find data for user "${user.username}"`
    );
  }
  return [authData.apiKey];
};

export const findUserAuthData = ({
  username,
  password,
}: {
  username: string;
  password: string;
}): UserAuthData | undefined => {
  return config.users.find(
    u => u.username === username && u.password === password
  );
};
