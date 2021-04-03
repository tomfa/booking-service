import config from '../../config';
import { testRequest } from '../../testUtils/controllers.utils';
import { UserWithTokenData } from '../../utils/auth/types';
import { getAuth } from '../../utils/auth/token';
import { decodeUrlSafeBase64 } from '../../utils/base64';
import { login } from './login';

describe('login', () => {
  const user = config.users[0];
  it('returns 200 OK with token', async () => {
    const { status, json } = await testRequest(login, {
      method: 'post',
      body: { username: user.username, password: user.password },
    });

    expect(status).toBe(200);
    const { username, apiKey, jwt } = json.data as UserWithTokenData;
    expect(username).toBe(user.username);
    expect(getAuth(jwt)).toEqual(
      expect.objectContaining({
        isExpired: false,
        permissions: ['api:*'],
        role: 'user',
        username: user.username,
      })
    );
    expect(getAuth(decodeUrlSafeBase64(apiKey))).toEqual(
      expect.objectContaining({
        isExpired: false,
        permissions: ['api:generate:from_template'],
        role: 'user',
        username: 'test-user',
      })
    );
  });
  it('returns 401 if username or password is wrong', async () => {
    const { status, message } = await testRequest(login, {
      method: 'post',
      body: { username: user.username, password: 'incorrect-password' },
    });

    expect(status).toBe(401);
    expect(message).toEqual('Wrong username or password');
  });
  it('returns 400 if username is missing', async () => {
    const { status, errors } = await testRequest(login, {
      method: 'post',
      body: { password: user.password },
    });

    expect(status).toBe(400);
    expect(errors).toContain('username: Data missing');
  });
  it('returns 400 if username is missing', async () => {
    const { status, errors } = await testRequest(login, {
      method: 'post',
      body: { username: user.username },
    });

    expect(status).toBe(400);
    expect(errors).toContain('password: Data missing');
  });
});
