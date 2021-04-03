import { UserWithPassword } from './auth/types';
import { getUsersFromEnv } from './env.utils';

describe('getUsersFromEnv', () => {
  const user: UserWithPassword = {
    username: 'darth-vader',
    password: 'death-star',
  };
  it('returns user objects', () => {
    const envVar = `${user.username}:${user.password}`;

    expect(getUsersFromEnv(envVar)).toEqual([user]);
  });
  it('handles multiple users', () => {
    const user2: UserWithPassword = {
      username: 'luke-skywalker',
      password: 'your-thoughts-betray-you',
    };
    const envVar =
      `${user.username}:${user.password}` +
      ';' +
      `${user2.username}:${user2.password}`;

    expect(getUsersFromEnv(envVar)).toEqual([user, user2]);
  });
  it('returns a empty list for missing value', () => {
    expect(getUsersFromEnv(undefined)).toEqual([]);
  });
});
