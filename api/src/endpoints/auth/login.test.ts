import config from '../../config';
import { testRequest } from '../../testUtils/controllers.utils';
import { login } from './login';

describe('login', () => {
  const user = config.users[0];
  it('returns 200 OK with token', async () => {
    const { status, json } = await testRequest(login, {
      method: 'post',
      body: { username: user.username, password: user.password },
    });

    expect(status).toBe(200);
    expect(json.data).toEqual({ username: user.username, apiKey: user.apiKey });
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
