import { Auth } from './types';
import { hasPermission, permissions } from './permissions';

describe('hasPermission', () => {
  it('returns true if having permission', async () => {
    const permission = 'api:generate:from_template';
    const auth: Auth = {
      sub: null,
      customerId: null,
      permissions: [permission],
    };

    const isGranted = hasPermission(auth, permission);

    expect(isGranted).toBe(true);
  });
  test('returns true for wildcard', async () => {
    const permission = '*';
    const auth: Auth = {
      sub: null,
      customerId: null,
      permissions: [permission],
    };

    const isGranted = hasPermission(auth, 'api:generate:from_template');

    expect(isGranted).toBe(true);
  });
  it('supports parital wildcard', async () => {
    const permission = 'api:generate:*';
    const auth: Auth = {
      sub: null,
      customerId: null,
      permissions: [permission],
    };

    const isGranted = hasPermission(auth, 'api:generate:from_template');

    expect(isGranted).toBe(true);
  });
  it('handles vailable: prefix', async () => {
    const permission = `vailable:${permissions.UPDATE_RESOURCE}`;
    const auth: Auth = {
      sub: null,
      customerId: null,
      permissions: [permission],
    };

    const isGranted = hasPermission(auth, permissions.UPDATE_RESOURCE);

    expect(isGranted).toBe(true);
  });
});