import config from '../config';
import { TokenData } from './types';
import { addPermissionPrefixIfNeeded, hasPermission } from './permissions';
import { getAuthTokenData, sign } from './jwt';

export const createJWTtoken = (
  username: string,
  permissions: string[] = ['api:*']
): string => {
  const data: Omit<TokenData, 'iat' | 'exp'> = {
    iss: config.jwt.issuer,
    aud: config.jwt.audience,
    sub: username,
    permissions: permissions.map(addPermissionPrefixIfNeeded),
    role: 'user',
  };
  return sign(data);
};

describe('hasPermission', () => {
  const username = 'testy';
  it('returns true if having permission', async () => {
    const permission = 'api:generate:from_template';
    const token = createJWTtoken(username, [permission]);
    const auth = await getAuthTokenData(token);

    const isGranted = hasPermission(auth, permission);

    expect(isGranted).toBe(true);
  });
  test('returns true for wildcard', async () => {
    const permissions = ['*'];
    const token = createJWTtoken(username, permissions);
    const auth = await getAuthTokenData(token);

    const isGranted = hasPermission(auth, 'api:generate:from_template');

    expect(isGranted).toBe(true);
  });
  it('supports parital wildcard', async () => {
    const permissions = ['api:generate:*'];
    const token = createJWTtoken(username, permissions);
    const auth = await getAuthTokenData(token);

    const isGranted = hasPermission(auth, 'api:generate:from_template');

    expect(isGranted).toBe(true);
  });
});
