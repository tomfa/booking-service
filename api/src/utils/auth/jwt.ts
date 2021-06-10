import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import * as fetch from 'node-fetch';
import { JSONObject } from '@booking-service/shared';
import config from '../../config';
import { BadAuthenticationError } from '../errors/BadAuthenticatedError';
import { APITokenData, TokenData } from './types';

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
  return getAPITokenData(keyStore, apiToken);
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

const validateTokenPermissions = (permissions: unknown) => {
  if (!Array.isArray(permissions)) {
    throw new BadAuthenticationError(
      `Token claim 'permissions' is missing or not an array`
    );
  }
  if (!permissions.find(p => p.startsWith('vailable'))) {
    throw new BadAuthenticationError(
      `Claim 'permissions' does not contain any vailable* permissions.'`
    );
  }
};

const validateTokenIssuer = (iss: unknown) => {
  if (!iss) {
    throw new BadAuthenticationError(`Token claim 'iss' is missing`);
  }

  if (iss === config.jwt.issuer) {
    return;
  }

  const isKnownIssuer = true; // TODO: Read from DB or cache
  if (!isKnownIssuer) {
    throw new BadAuthenticationError(
      `Issuer ${iss} is not authorized for this API`
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

export const cleanIssuer = (iss: string): string =>
  !iss.startsWith('http') ? iss : iss.split('//').reverse()[0];

function mapToTokenData(apiToken: string): TokenData {
  const data = jwt.decode(apiToken) as APITokenData;
  validateTokenIssuer(data.iss);
  validateTokenAudience(data.aud);
  validateTokenPermissions(data.permissions);
  validateExpiry(data.exp);
  return {
    ...data,
    iss: cleanIssuer(data.iss),
    role: 'user',
    aud: data.aud || config.jwt.audience,
  };
}

async function getKeyStore(issuer: string): Promise<jose.JWK.KeyStore> {
  const url = `https://${issuer}/.well-known/jwks.json`;
  try {
    const response = await fetch(url);
    const json = await response.json();
    const keyStore = await jose.JWK.asKeyStore(json);
    return keyStore;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`Error when retrieving jwks`, err);
    throw new BadAuthenticationError(`Unable to get key store at ${url}`);
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
      `Unable to verify that token originated from  it's issuer.`
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
