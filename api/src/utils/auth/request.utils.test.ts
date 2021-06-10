import * as jwt from 'jsonwebtoken';
import { getMockReq } from '@jest-mock/express';
import config from '../../config';
import { BadAuthenticationError } from '../errors/BadAuthenticatedError';
import { NotAuthenticatedError } from '../errors/NotAuthenticatedError';
import { createApiKey, createJWTtoken } from './token';
import { getUser, getUserOrThrow } from './request.utils';

describe('getUser', () => {
  const username = 'test-user';
  const authHeaderPermission = config.jwt.permissionPrefix + 'api:*';
  const apiKeyPermission = config.jwt.permissionPrefix + 'api:generate:*';
  const authHeaderValue = createJWTtoken(username, [authHeaderPermission]);
  const token = createApiKey(username, [apiKeyPermission]);

  it('returns user from authentication header', async () => {
    const req = getMockReq({
      headers: {
        authorization: `Bearer ${authHeaderValue}`,
      },
    });

    const user = await getUser(req);

    expect(user).toEqual({
      username,
      isExpired: false,
      permissions: [authHeaderPermission],
      role: 'user',
    });
  });

  it('returns user from token query parameter', async () => {
    const req = getMockReq({ query: { token } });

    const user = await getUser(req);

    expect(user).toEqual({
      username,
      isExpired: false,
      permissions: [apiKeyPermission],
      role: 'user',
    });
  });

  it('returns user from header if both header and query token is present', async () => {
    const req = getMockReq({
      query: { token },
      headers: {
        authorization: `Bearer ${authHeaderValue}`,
      },
    });

    const user = await getUser(req);

    expect(user).toEqual({
      username,
      isExpired: false,
      permissions: [authHeaderPermission],
      role: 'user',
    });
  });

  it('returns null if no auth present', async () => {
    const req = getMockReq();

    const user = await getUser(req);

    expect(user).toBe(null);
  });
  it('throws BadAuthenticationError if auth is invalid', async () => {
    const invalidSigningKey = 'i-am-trying-to-hack';
    const validTokenData = {
      iss: config.jwt.issuer,
      aud: config.jwt.audience,
      sub: username,
      permissions: ['*'],
      role: 'user',
    };
    const badToken = jwt.sign(validTokenData, invalidSigningKey);

    const req = getMockReq({
      headers: { authorization: `Bearer ${badToken}` },
    });

    try {
      await getUser(req);
      fail('Getting user with bad auth should throw error');
    } catch (err) {
      expect(err).toBeInstanceOf(BadAuthenticationError);
    }
  });
});
describe('getUserOrThrow', () => {
  const username = 'test-user';
  const authHeaderPermission = config.jwt.permissionPrefix + 'api:*';
  const authHeaderValue = createJWTtoken(username, [authHeaderPermission]);

  it('returns user if auth present', async () => {
    const req = getMockReq({
      headers: {
        authorization: `Bearer ${authHeaderValue}`,
      },
    });

    const user = await getUser(req);

    expect(user).toEqual({
      username,
      isExpired: false,
      permissions: [authHeaderPermission],
      role: 'user',
    });
  });
  it('throws NotAuthenticated error if no auth present', async () => {
    const req = getMockReq();

    try {
      await getUserOrThrow(req);
      fail('getUserOrThrow should throw when no auth exists');
    } catch (err) {
      expect(err).toBeInstanceOf(NotAuthenticatedError);
    }
  });
});
