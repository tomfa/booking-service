import { UserAuthData } from './types';
import { getUsersFromEnv } from './env.utils';

describe('getUsersFromEnv', () => {
  const user: UserAuthData = {
    username: 'darth-vader',
    password: 'death-star',
    apiKey: 'i-am-your-father',
  };
  it('returns user objects', () => {
    const envVar = `${user.username}:${user.password}:${user.apiKey}`;

    expect(getUsersFromEnv(envVar)).toEqual([user]);
  });
  it('handles multiple users', () => {
    const user2 = {
      username: 'luke-skywalker',
      password: 'your-thoughts-betray-you',
      apiKey: 'the-force-is-strong-in-my-familiy',
    };
    const envVar =
      `${user.username}:${user.password}:${user.apiKey}` +
      ';' +
      `${user2.username}:${user2.password}:${user2.apiKey}`;

    expect(getUsersFromEnv(envVar)).toEqual([user, user2]);
  });
  it('returns a empty list for missing value', () => {
    expect(getUsersFromEnv(undefined)).toEqual([]);
  });
});
