/* eslint-disable unused-imports/no-unused-vars */
import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import nock from 'nock';

import { JWK } from 'node-jose';
import config from '../config';
import { cache } from '../utils/cache/memoryCache';
import * as b64 from '../utils/encoding/base64';
import { BadAuthenticationError, ErrorCode } from '../utils/errors';
import { JSONObject } from '../types';
import { sign, verify } from './jwt';
import KeyStore = JWK.KeyStore;

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

const getPublicPrivateKeyCombo = () => ({
  privateKey:
    '-----BEGIN RSA PRIVATE KEY-----\n' +
    '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\n' +
    '-----END RSA PRIVATE KEY-----',
  publicKey:
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAuz54y4ZRtoGJ8mSppASq\n' +
    'd0ASRFAhiWIb7HrSf9kmDo1yBepAB93ABArwqu6ALEBQ48Iac83A/PTnG3SAoVTZ\n' +
    'X2pW1edvFGqDFSeO/rzWAN+73t+BxSf0LsK1XmY77sKhYGHSNtwZgfQfZwR1Lwrg\n' +
    'r2LO1NTaGEs+Ngw1ijXS1tofiV255ZrDTmzTtA9t+mjO+neQtCoC3xCxUnQ5Z8nB\n' +
    'g1YDJ8VMDV9jYc4sx0Yx1wZC1YIWGxteB0E2pnhO8BwPW1FuPuwvfGm7BCmq9WVX\n' +
    'Lb8WniBI0gqA5d7RW0tqg71tYqWvKDlTDJHuwhczs7NG5F01OxH3sV+IqdaDcTpr\n' +
    'sIsbqXsbXy9GOZxKcpT2omQKljYUgDiTBH3kywTUHobb7Gba59ydQ98IB3TyJL2a\n' +
    'BURWh79SoKixxd8wFXucQ5gmgM0pPkqvatKfBCf/c6K0k3AzyAw1MOYYT7TP6AXe\n' +
    '5n5xN+UZn3W6PskSYZ0p3HQcRrH8UCy8DJat5kUG6EsrDJq8p8SzqaO5tfQ62GK+\n' +
    '2qgaR5fAHZmQER5oMPQ4Ni8Z8v1ewl5WKKTDfHwQ0kovh+TnnEhtPVNgscPxy8q+\n' +
    '53xND7yf9CH/1DUAU48zkTtJZHwOakwKAuugMfP98iqAuBiCGyKGNn61ZS9X0H9S\n' +
    'wwqpdFa/zl9WtvvKjflTu0MCAwEAAQ==\n' +
    '-----END PUBLIC KEY-----',
});

describe('Keystore/keys management', () => {
  const keyStoreJson = {
    keys: [
      {
        kty: 'RSA',
        kid: 'vWcD9cJT4RuYxNSWgpLE0jpL0XClex53D4cww0jN6ak',
        n:
          'uz54y4ZRtoGJ8mSppASqd0ASRFAhiWIb7HrSf9kmDo1yBepAB93ABArwqu6ALEBQ48Iac83A_PTnG3SAoVTZX2pW1edvFGqDFSeO_rzWAN-73t-BxSf0LsK1XmY77sKhYGHSNtwZgfQfZwR1Lwrgr2LO1NTaGEs-Ngw1ijXS1tofiV255ZrDTmzTtA9t-mjO-neQtCoC3xCxUnQ5Z8nBg1YDJ8VMDV9jYc4sx0Yx1wZC1YIWGxteB0E2pnhO8BwPW1FuPuwvfGm7BCmq9WVXLb8WniBI0gqA5d7RW0tqg71tYqWvKDlTDJHuwhczs7NG5F01OxH3sV-IqdaDcTprsIsbqXsbXy9GOZxKcpT2omQKljYUgDiTBH3kywTUHobb7Gba59ydQ98IB3TyJL2aBURWh79SoKixxd8wFXucQ5gmgM0pPkqvatKfBCf_c6K0k3AzyAw1MOYYT7TP6AXe5n5xN-UZn3W6PskSYZ0p3HQcRrH8UCy8DJat5kUG6EsrDJq8p8SzqaO5tfQ62GK-2qgaR5fAHZmQER5oMPQ4Ni8Z8v1ewl5WKKTDfHwQ0kovh-TnnEhtPVNgscPxy8q-53xND7yf9CH_1DUAU48zkTtJZHwOakwKAuugMfP98iqAuBiCGyKGNn61ZS9X0H9SwwqpdFa_zl9WtvvKjflTu0M',
        e: 'AQAB',
      },
    ],
  };
  let publicKeyStore: KeyStore;
  let privateKeyStore: KeyStore;
  let publicKey: JWK.Key;
  let privateKey: JWK.Key;
  const keys = getPublicPrivateKeyCombo();
  beforeAll(async () => {
    publicKey = await jose.JWK.asKey(keys.publicKey, 'pem');
    privateKey = await jose.JWK.asKey(keys.privateKey, 'pem');
    publicKeyStore = jose.JWK.createKeyStore();
    await publicKeyStore.add(publicKey);
    privateKeyStore = jose.JWK.createKeyStore();
    await privateKeyStore.add(privateKey);
  });
  it('Loads public key to keystorejson', async () => {
    expect(publicKeyStore.toJSON()).toEqual(keyStoreJson);
    const key = await jose.JWK.asKey(publicKeyStore.all()[0]);
    const reversedPem = key.toPEM().replace(/\r/g, '').trim();
    expect(reversedPem).toEqual(keys.publicKey);
  });
  it('can verify what it has signed', async () => {
    const originalPayload = { a: 1 };
    const signer = jose.JWS.createSign(privateKey);
    // @ts-ignore
    const { payload, signatures } = await signer
      .update(JSON.stringify(originalPayload))
      .final();

    const token = `${signatures[0].protected}.${payload}.${signatures[0].signature}`;
    const verified = jwt.verify(token, keys.publicKey);
    expect(originalPayload).toEqual(verified);
  });
  it('Example: Decode third party signing', async () => {
    const payload = { a: 1 };
    const token = jwt.sign(payload, keys.privateKey, {
      algorithm: 'RS256',
      expiresIn: '1 hour',
    });
    const keystore = jose.JWK.createKeyStore();
    const joseKey = await jose.JWK.asKey(keys.publicKey, 'pem');
    await keystore.add(joseKey);

    const data = await jose.JWS.createVerify(keystore).verify(token);
    expect(JSON.parse(data.payload.toString())).toEqual(
      expect.objectContaining(payload)
    );
  });
});
