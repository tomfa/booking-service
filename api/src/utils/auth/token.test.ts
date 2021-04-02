import { createJWTtoken, getAuth, hasPermission } from './token';

describe('hasPermission', () => {
  const username = 'testy';
  it('returns true if having permission', () => {
    const permission = 'api:generate:from_template';
    const token = createJWTtoken(username, [permission]);
    const auth = getAuth(token);

    const isGranted = hasPermission(auth, permission);

    expect(isGranted).toBe(true);
  });
  test('returns false if not having permission', () => {
    const token = createJWTtoken(username, []);
    const auth = getAuth(token);

    const isGranted = hasPermission(auth, 'api:generate:from_template');

    expect(isGranted).toBe(false);
  });
  test('returns true for wildcard', () => {
    const permissions = ['*'];
    const token = createJWTtoken(username, permissions);
    const auth = getAuth(token);

    const isGranted = hasPermission(auth, 'api:generate:from_template');

    expect(isGranted).toBe(true);
  });
  it('supports parital wildcard', () => {
    const permissions = ['api:generate:*'];
    const token = createJWTtoken(username, permissions);
    const auth = getAuth(token);

    const isGranted = hasPermission(auth, 'api:generate:from_template');

    expect(isGranted).toBe(true);
  });
});
