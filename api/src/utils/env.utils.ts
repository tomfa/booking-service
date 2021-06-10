import { UserWithPassword } from './auth/types';

// TODO: Make an actual user system
export const getUsersFromEnv = (
  envString: string | undefined
): UserWithPassword[] => {
  if (!envString) {
    // eslint-disable-next-line no-console
    console.log(`No users found`);
    return [];
  }
  // TODO: Max fragility!
  const toUser = (singleUserString: string): UserWithPassword => {
    const data = singleUserString.split(':');
    return { username: data[0], password: data[1] };
  };
  return envString.split(';').map(toUser);
};

// TODO: Make an actual user system
export const getAcceptedIssuersFromEnv = (
  envString: string | undefined
): string[] => {
  if (!envString) {
    // eslint-disable-next-line no-console
    console.log(`No issuers found found`);
    return [];
  }
  return envString.split(',');
};

export const getOriginsFromEnv = (envString: string | undefined): string[] => {
  if (!envString) {
    return [];
  }
  return envString.split(',').map(domain => domain.trim());
};
