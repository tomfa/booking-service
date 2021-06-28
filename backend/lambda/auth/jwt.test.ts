/* eslint-disable unused-imports/no-unused-vars */
import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import * as nock from 'nock';

import config from '../config';
import { cache } from '../utils/cache/memoryCache';
import * as b64 from '../utils/encoding/base64';
import { BadAuthenticationError, ErrorCode } from '../utils/errors';
import { JSONObject } from '../types';
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

const createThirdPartyToken = async (
  thirdPartyData: JSONObject,
  issuer: string
) => {
  const keystore = jose.JWK.createKeyStore();
  const key = await jose.JWK.createKey('RSA', 2048, {
    alg: 'RS256',
    use: 'sig',
  });
  await keystore.add(key);
  const json = keystore.toJSON(false);

  // @ts-ignore
  const { payload, signatures } = await jose.JWS.createSign(key)
    .update(JSON.stringify(thirdPartyData))
    .final();

  return {
    token: `${signatures[0].protected}.${payload}.${signatures[0].signature}`,
    keystore: json,
  };
};

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

  it('throws an error if "iss" is us, but is not signed by us', async () => {
    const invalidToken = jwt.sign(data, 'notourkey');

    try {
      await verify(invalidToken);
      fail('Verifying invalid token should throw an error');
    } catch (err) {
      expect(err instanceof BadAuthenticationError).toBe(true);
    }
  });
  it('returns the data contained in the jwt', async () => {
    const token = sign(data);

    const verifiedData = await verify(token);

    expect(verifiedData).toEqual(expect.objectContaining(data));
  });
  it('accepts tokens issued by accepted third parties', async () => {
    cache.clear();
    const validIssuer = config.jwt.acceptedIssuers[0];
    const thirdPartyData = {
      ...data,
      iss: validIssuer,
      exp: Math.floor(Date.now() / 1000) + 2000,
    };
    const { token, keystore } = await createThirdPartyToken(
      thirdPartyData,
      validIssuer
    );
    nock(`https://${validIssuer}`)
      .get('/.well-known/jwks.json')
      .reply(200, keystore);

    const verifiedData = await verify(token);

    expect(verifiedData).toEqual(thirdPartyData);
  });
  it('utilizes a cache to prevent frequent retrieval of third party JWK keys', async () => {
    cache.clear();
    const validIssuer = config.jwt.acceptedIssuers[0];
    const thirdPartyData = {
      ...data,
      iss: validIssuer,
      exp: Math.floor(Date.now() / 1000) + 2000,
    };
    const { token, keystore } = await createThirdPartyToken(
      thirdPartyData,
      validIssuer
    );
    nock(`https://${validIssuer}`)
      .get('/.well-known/jwks.json')
      .reply(200, keystore);

    await verify(token); // "Spends" nock above

    nock(`https://${validIssuer}`).get('/.well-known/jwks.json').reply(404);

    await verify(token); // Goes towards cache
    cache.clear();

    try {
      await verify(token);
      fail('Fetching keys from server should return 404');
    } catch (err) {
      expect(err instanceof BadAuthenticationError).toBe(true);
      expect(err.httpCode).toBe(403);
      expect(err.errorCode).toBe(ErrorCode.BAD_AUTHENTICATION);
      expect(err.message).toBe(
        `Unable to get key store. https://thirdparty.com/.well-known/jwks.json returned HTTP status 404`
      );
    }
  });
  it('rejects tokens issued by accepted third parties, if no jwks endpoint exists', async () => {
    cache.clear();
    const validIssuer = config.jwt.acceptedIssuers[0];
    const thirdPartyData = {
      ...data,
      iss: validIssuer,
      exp: Math.floor(Date.now() / 1000) + 2000,
    };
    const { token } = await createThirdPartyToken(thirdPartyData, validIssuer);
    nock(`https://${validIssuer}`).get('/.well-known/jwks.json').reply(404);

    try {
      await verify(token);
      fail('Verifying invalid token should throw an error');
    } catch (err) {
      expect(err instanceof BadAuthenticationError).toBe(true);
      expect(err.httpCode).toBe(403);
      expect(err.errorCode).toBe(ErrorCode.BAD_AUTHENTICATION);
      expect(err.message).toBe(
        `Unable to get key store. https://thirdparty.com/.well-known/jwks.json returned HTTP status 404`
      );
    }
  });
  it('rejects tokens issued by unknown third parties', async () => {
    const unknownIssuer = 'iamnotreal.com';
    const thirdPartyData = {
      ...data,
      iss: unknownIssuer,
      exp: Math.floor(Date.now() / 1000) + 2000,
    };
    const { token } = await createThirdPartyToken(
      thirdPartyData,
      unknownIssuer
    );
    try {
      await verify(token);
      fail('Verifying invalid token should throw an error');
    } catch (err) {
      expect(err instanceof BadAuthenticationError).toBe(true);
      expect(err.httpCode).toBe(403);
      expect(err.errorCode).toBe(ErrorCode.BAD_AUTHENTICATION);
      expect(err.message).toBe(
        `Issuer 'iamnotreal.com' is not authorized for this API`
      );
    }
  });
});
