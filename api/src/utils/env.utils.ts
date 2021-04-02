import { UserAuthData } from './auth/types';

// TODO: Make an actual user system
export const getUsersFromEnv = (
  envString: string | undefined
): UserAuthData[] => {
  if (!envString) {
    // eslint-disable-next-line no-console
    console.log(`No users found`);
    return [];
  }
  // TODO: Max fragility!
  const toUser = (singleUserString: string): UserAuthData => {
    const data = singleUserString.split(':');
    return { username: data[0], password: data[1], apiKey: data[2] };
  };
  return envString.split(';').map(toUser);
};

export const getOriginsFromEnv = (envString: string | undefined): string[] => {
  if (!envString) {
    return [];
  }
  return envString.split(',').map(domain => domain.trim());
};
