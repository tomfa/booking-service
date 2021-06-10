import { createJWTtoken, getAuth, hasPermission } from './token';

describe('hasPermission', () => {
  const username = 'testy';
  it('returns true if having permission', async () => {
    const permission = 'api:generate:from_template';
    const token = createJWTtoken(username, [permission]);
    const auth = await getAuth(token);

    const isGranted = hasPermission(auth, permission);

    expect(isGranted).toBe(true);
  });
  test('returns true for wildcard', async () => {
    const permissions = ['*'];
    const token = createJWTtoken(username, permissions);
    const auth = await getAuth(token);

    const isGranted = hasPermission(auth, 'api:generate:from_template');

    expect(isGranted).toBe(true);
  });
  it('supports parital wildcard', async () => {
    const permissions = ['api:generate:*'];
    const token = createJWTtoken(username, permissions);
    const auth = await getAuth(token);

    const isGranted = hasPermission(auth, 'api:generate:from_template');

    expect(isGranted).toBe(true);
  });
});
