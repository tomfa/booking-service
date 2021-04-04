import * as jwt from 'jsonwebtoken';
import { getMockReq } from '@jest-mock/express';
import config from '../../config';
import { BadAuthenticationError } from '../errors/BadAuthenticatedError';
import { NotAuthenticatedError } from '../errors/NotAuthenticatedError';
import { createApiKey, createJWTtoken } from './token';
import { getUser, getUserOrThrow } from './request.utils';

describe('getUser', () => {
  const username = 'test-user';
  const authHeaderPermission = 'api:*';
  const apiKeyPermission = 'api:generate:*';
  const authHeaderValue = createJWTtoken(username, [authHeaderPermission]);
  const token = createApiKey(username, [apiKeyPermission]);

  it('returns user from authentication header', () => {
    const req = getMockReq({
      headers: {
        authorization: `Bearer ${authHeaderValue}`,
      },
    });

    const user = getUser(req);

    expect(user).toEqual({
      username,
      isExpired: false,
      permissions: ['api:*'],
      role: 'user',
    });
  });

  it('returns user from token query parameter', () => {
    const req = getMockReq({ query: { token } });

    const user = getUser(req);

    expect(user).toEqual({
      username,
      isExpired: false,
      permissions: [apiKeyPermission],
      role: 'user',
    });
  });

  it('returns user from header if both header and query token is present', () => {
    const req = getMockReq({
      query: { token },
      headers: {
        authorization: `Bearer ${authHeaderValue}`,
      },
    });

    const user = getUser(req);

    expect(user).toEqual({
      username,
      isExpired: false,
      permissions: [authHeaderPermission],
      role: 'user',
    });
  });

  it('returns null if no auth present', () => {
    const req = getMockReq();

    const user = getUser(req);

    expect(user).toBe(null);
  });
  it('throws BadAuthenticationError if auth is invalid', () => {
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
      getUser(req);
      fail('Getting user with bad auth should throw error');
    } catch (err) {
      expect(err).toBeInstanceOf(BadAuthenticationError);
    }
  });
});
describe('getUserOrThrow', () => {
  const username = 'test-user';
  const authHeaderPermission = 'api:*';
  const authHeaderValue = createJWTtoken(username, [authHeaderPermission]);

  it('returns user if auth present', () => {
    const req = getMockReq({
      headers: {
        authorization: `Bearer ${authHeaderValue}`,
      },
    });

    const user = getUser(req);

    expect(user).toEqual({
      username,
      isExpired: false,
      permissions: ['api:*'],
      role: 'user',
    });
  });
  it('throws NotAuthenticated error if no auth present', () => {
    const req = getMockReq();

    try {
      getUserOrThrow(req);
      fail('getUserOrThrow should throw when no auth exists');
    } catch (err) {
      expect(err).toBeInstanceOf(NotAuthenticatedError);
    }
  });
});
