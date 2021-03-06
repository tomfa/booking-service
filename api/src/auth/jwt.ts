import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import fetch from 'node-fetch';

import config from '../config';
import { cache } from '../utils/cache/memoryCache';
import {
  BadAuthenticationError,
  GenericBookingError,
  NotAuthenticatedError,
} from '../utils/errors';
import { JSONObject } from '../types';
import getCustomerByIssuer from '../functions/getCustomerByIssuer';
import { Customer } from '../graphql/generated/types';
import getCustomerByEmail from '../functions/getCustomerByEmail';
import { APITokenData, TokenData, Auth, AuthTokenData, Role } from './types';
import { getPermissionsFromToken } from './permissions';

const getCustomerFromToken = async (
  token: AuthTokenData
): Promise<[Customer, string | null]> => {
  let customer;
  const isIssuedByUs = token.iss === config.jwt.issuer;
  if (isIssuedByUs) {
    customer = await getCustomerByEmail({ email: token.sub });
    if (!customer) {
      throw new BadAuthenticationError(
        `Unable to find customer with email: ${token.sub}`
      );
    }
  } else {
    customer = await getCustomerByIssuer({ issuer: token.iss });
    if (!customer) {
      throw new BadAuthenticationError(
        `Unable to find customer with issuer: ${token.iss}`
      );
    }
  }

  const sub = isIssuedByUs ? null : token.sub;
  return [customer, sub];
};

export const getVerifiedTokenData = async (
  authHeader: string | undefined
): Promise<Auth> => {
  if (!authHeader) {
    throw new NotAuthenticatedError(`Authentication header missing`);
  }
  const authTokenParts = authHeader.split(' ');
  const authToken = authTokenParts[authTokenParts.length - 1];
  if (!authToken) {
    throw new NotAuthenticatedError(`Invalid authentication header`);
  }
  const token = await getAuthTokenData(authToken);
  const [customer, sub] = await getCustomerFromToken(token);
  if (!customer.enabled) {
    throw new BadAuthenticationError(`Customer ${customer.id} is disabled`);
  }
  return {
    sub,
    customerId: customer.id,
    permissions: getPermissionsFromToken(token),
  };
};

export function sign<T extends JSONObject>(payload: T): string {
  const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '31 days' });
  return token;
}

export async function verify(apiToken: string): Promise<TokenData> {
  const data = mapToTokenData(apiToken);
  const isIssuedByUs = data.iss === config.jwt.issuer;
  if (isIssuedByUs) {
    return jwt.verify(apiToken, config.jwt.secret) as TokenData;
  }
  const keyStore = await getKeyStore(data.iss);
  const tokenData = await getAPITokenData(keyStore, apiToken);
  return tokenData;
}

const getAcceptedAudiences = () => {
  const expectedIssuer = config.jwt.issuer
    .replace('http://', '')
    .replace('https://', '')
    .replace('/', '');
  const apexIssuer = expectedIssuer
    .split('.')
    .reverse()
    .slice(0, 2)
    .reverse()
    .join('.');
  return [
    config.jwt.issuer,
    apexIssuer,
    expectedIssuer,
    `https://${apexIssuer}`,
    `https://${apexIssuer}/`,
    `https://${expectedIssuer}`,
    `https://${expectedIssuer}/`,
  ];
};

const validateTokenAudience = (val: unknown) => {
  const acceptMissingAudience = true;
  const acceptedAudiences = getAcceptedAudiences();
  if (acceptMissingAudience && !val) {
    return;
  }
  if (!acceptMissingAudience && !val) {
    throw new BadAuthenticationError(`Token claim 'aud' is missing`);
  }
  if (typeof val === 'string') {
    if (acceptedAudiences.includes(val)) {
      return;
    }
    throw new BadAuthenticationError(
      `Token claim 'aud' does not contain '${config.jwt.issuer}'`
    );
  }
  if (Array.isArray(val)) {
    if (val.find(a => acceptedAudiences.includes(a))) {
      return;
    }
    throw new BadAuthenticationError(
      `Token claim 'aud' does not include '${config.jwt.issuer}'`
    );
  }
  throw new BadAuthenticationError(`Token claim 'aud' is of unknown type`);
};

const validateTokenPermissions = (token: APITokenData) => {
  const { role, permissions } = token;
  if (role === 'user' || role === 'admin') {
    return;
  }
  if (!Array.isArray(permissions)) {
    throw new BadAuthenticationError(
      `Token claim 'permissions' is missing or not an array`
    );
  }
  if (!permissions.find(p => p.startsWith(config.jwt.permissionPrefix))) {
    throw new BadAuthenticationError(
      `Claim 'permissions' does not contain any permissions starting with '${config.jwt.permissionPrefix}'`
    );
  }
};

const validateTokenIssuer = (iss: unknown) => {
  if (!iss) {
    throw new BadAuthenticationError(`Token claim 'iss' is missing`);
  }
  if (typeof iss !== 'string') {
    throw new BadAuthenticationError(
      `Token claim 'iss' must be of type string`
    );
  }
};

const validateExpiry = (val: unknown) => {
  if (val == null) {
    throw new BadAuthenticationError(`Token claim 'exp' is missing`);
  }
  let cleanedVal = val;
  if (typeof val === 'string') {
    cleanedVal = parseInt(val);
  }
  if (!Number.isInteger(cleanedVal)) {
    throw new BadAuthenticationError(`Token claim 'exp' must be a number`);
  }
  if (Date.now() > (cleanedVal as number) * 1000) {
    throw new BadAuthenticationError(`Token is expired`);
  }
};

export const cleanIssuer = (iss: string | undefined): string => {
  if (!iss) {
    throw new Error(`Unable to clean undefined issuer value`);
  }
  return !iss.startsWith('http') ? iss : iss.split('//').reverse()[0];
};

export const cleanRole = (role?: string): Role | null => {
  if (role === 'user') {
    return 'user';
  }
  if (role === 'admin') {
    return 'admin';
  }
  if (role === 'superuser') {
    return 'superuser';
  }
  return null;
};

function mapToTokenData(apiToken: string): TokenData {
  const data = (jwt.decode(apiToken) as APITokenData) || null;
  if (!data) {
    throw new NotAuthenticatedError(`Invalid authentication token`);
  }
  validateTokenIssuer(data.iss);
  validateTokenAudience(data.aud);
  validateTokenPermissions(data);
  validateExpiry(data.exp);
  return {
    ...data,
    iss: cleanIssuer(data.iss),
    role: cleanRole(data.role) || 'user',
    aud: data.aud || config.jwt.audience,
  };
}

async function getKeyStore(issuer: string): Promise<jose.JWK.KeyStore> {
  const cacheValue = cache.get(issuer);
  if (cacheValue) {
    return jose.JWK.asKeyStore(cacheValue);
  }
  if (issuer === 'auth.kroloftet.no') {
    // TODO: Remove this hardcoded key
    return jose.JWK.asKeyStore({
      keys: [
        {
          kty: 'RSA',
          kid: 'i5-QxjomQhRsjJZ_mvXN3SVoc_YmsDse-h2N4VrTk7A',
          n:
            '1ge5Qk10USuqgvti5yVf79T3CnkvjF8Rty6aYMxC7mZcPu052QXscBzmidsiKYo-fvdVu1eLN8nwRJCRNJ4LlIHJour2YJthuEse2nru9hJYjUzrjjWg6QISfJBlTzBh2DyMt7Dq1z-GW8bxO_Q9yAu7joKSYhd8sPJipI5YTAz0yNzg8g1Ifx6AGbBWToTz2PDR4_EoASwALEsPxmg-lsd7_Feemoi5oS0mNU2rBlb8I-g7oJX_wwTCOFSwgUi4fLpTJBIJKaSg14v4zP6c4GsmJoTwfyJDr2iBE3UFUsPNaAUvcW-udM8T4oJhb3xUd0-gyfhXlPBmcpNQRX_N35xFsFnG_g4i_z0bivxt_shpNdj9P57ajIlv7eEU9n2F-pg4WMzm9TNeT7zAn3gynuf4uJTYwZrP0YyoQebN4cskN-7YoVElY_YhhROJKLT4eFWvaieutnDTTtiUYlPveaM0SF_lhiBKO_zb8A9RFyT7nglWadkzNvQtux_AULf73RzeqscuHDcrfwk8T562XE2MzOWjFnqYUAildfewLri_f4bAnJXdv8K1CI8ghJnz7O91cbdbGCyiN5YbytzRCk17GJHnQXuWb2NfC7pdRD4-io3_Ms7HcnGAXSJ3QjYQ53-mqeu2tGvvqVl36vgjLqXeI-lBrnNSlZJ7AMfjMuM',
          e: 'AQAB',
        },
      ],
    });
  }
  const customer = await getCustomerByIssuer({ issuer });
  if (!customer) {
    throw new BadAuthenticationError(
      `Unable to find customer with issuer: ${issuer}`
    );
  }
  if (!customer.enabled) {
    throw new BadAuthenticationError(`Customer ${customer.id} is disabled`);
  }
  if (customer.publicKeys.length) {
    // Note: URL is not checked when keys are specified
    const keystore = jose.JWK.createKeyStore();
    const keys = await Promise.all(
      customer.publicKeys.map(key => jose.JWK.asKey(key, 'pem'))
    );
    await Promise.all(keys.map(key => keystore.add(key)));
    return keystore;
  }

  const url = `https://${issuer}/.well-known/jwks.json`;

  try {
    const response = await fetch(url);
    if (response.status >= 400) {
      throw new BadAuthenticationError(
        `Unable to get key store. ${url} returned HTTP status ${response.status}`
      );
    }
    const json = await response.json();
    cache.set({ key: url, value: json, expiresAfterMinutes: 180 });
    const keyStore = await jose.JWK.asKeyStore(json);
    return keyStore;
  } catch (err) {
    if (err instanceof GenericBookingError) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log(`Error when retrieving jwks`, err);
    throw new BadAuthenticationError(`Unable to parse key store from ${url}`);
  }
}

async function getAPITokenData(
  keyStore: jose.JWK.KeyStore,
  token: string
): Promise<TokenData> {
  let verifiedTokenData;
  try {
    verifiedTokenData = await jose.JWS.createVerify(keyStore).verify(token);
  } catch (err) {
    throw new BadAuthenticationError(
      `Unable to verify that token originated from it's issuer.`
    );
  }
  try {
    return JSON.parse(verifiedTokenData.payload.toString());
  } catch (err) {
    throw new BadAuthenticationError(
      `Non-JSON API token format: ${verifiedTokenData}`
    );
  }
}

export async function getAuthTokenData(key: string): Promise<AuthTokenData> {
  const data = await verify(key);
  return {
    iss: data.iss,
    sub: data.sub,
    role: data.role,
    permissions: data.permissions,
  };
}
