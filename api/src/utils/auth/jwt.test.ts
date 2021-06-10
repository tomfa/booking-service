/* eslint-disable unused-imports/no-unused-vars */
import * as jsonwebtoken from 'jsonwebtoken';
import * as b64 from '../base64';
import config from '../../config';
import { BadAuthenticationError } from '../errors/BadAuthenticatedError';
import { sign, verify } from './jwt';

describe('sign', () => {
  const data = { random: 15 };

  it('it returns a signed JWT of the passed data', () => {
    const token = sign(data);

    const [header, payload, signature] = token.split('.');
    const payloadJSON = JSON.parse(b64.decode(payload));

    expect(payloadJSON).toEqual(expect.objectContaining(data));
  });
  it('adds issued at', () => {
    const before = Math.floor(new Date().getTime() / 1000);
    const token = sign(data);
    const after = Math.floor(new Date().getTime() / 1000);

    const [header, payload, signature] = token.split('.');
    const payloadJSON = JSON.parse(b64.decode(payload));
    expect(Object.keys(payloadJSON)).toContain('iat');

    expect(payloadJSON.iat).toBeGreaterThanOrEqual(before);
    expect(payloadJSON.iat).toBeLessThanOrEqual(after);
  });
});

describe('sign', () => {
  const data = { random: 15 };

  it('it returns a signed JWT of the passed data', () => {
    const token = sign(data);

    const [header, payload, signature] = token.split('.');
    const payloadJSON = JSON.parse(b64.decode(payload));

    expect(payloadJSON).toEqual(expect.objectContaining(data));
  });
  it('adds issued at', () => {
    const before = Math.floor(new Date().getTime() / 1000);
    const token = sign(data);
    const after = Math.floor(new Date().getTime() / 1000);

    const [header, payload, signature] = token.split('.');

    const payloadJSON = JSON.parse(b64.decode(payload));
    expect(Object.keys(payloadJSON)).toContain('iat');
    expect(payloadJSON.iat).toBeGreaterThanOrEqual(before);
    expect(payloadJSON.iat).toBeLessThanOrEqual(after);
  });
});

describe('verify', () => {
  const data = {
    iss: config.jwt.issuer,
    aud: config.jwt.audience,
    sub: 'username',
    permissions: [config.jwt.permissionPrefix + 'api:*'],
    role: 'user',
  };

  it('throws an error if not signed by us', async () => {
    const invalidToken = jsonwebtoken.sign(data, 'notourkey');

    try {
      await verify(invalidToken);
      fail('Verifying invalid token should throw an error');
    } catch (err) {
      expect(err instanceof BadAuthenticationError).toBe(true);
    }
  });
  it('it returns a the data contained in the jwt', async () => {
    const token = sign(data);

    const verifiedData = await verify(token);

    expect(verifiedData).toEqual(expect.objectContaining(data));
  });
});
