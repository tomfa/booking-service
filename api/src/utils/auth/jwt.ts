import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import * as fetch from 'node-fetch';
import { JSONObject } from '@booking-service/shared';
import config from '../../config';
import { BadRequestError } from '../errors/BadRequestError';
import { BadAuthenticationError } from '../errors/BadAuthenticatedError';
import { APITokenData } from './types';

export function sign<T extends JSONObject>(payload: T): string {
  const token = jwt.sign(payload, config.jwt.secret);
  return token;
}

export function verify<T = JSONObject>(token: string): T {
  const data = jwt.verify(token, config.jwt.secret);
  return (data as unknown) as T;
}

function mapToAPIToken(apiToken: string): APITokenData {
  const data = jwt.decode(apiToken) as APITokenData;
  const acceptedAudiences = [
    'api.vailable.eu',
    'https://api.vailable.eu',
    'https://api.vailable.eu/',
  ];
  const acceptMissingAudience = true;
  if (!data.iss) {
    throw new BadRequestError({
      field: 'iss',
      error: 'Token claim "iss" is missing',
    });
  }
  if (!Array.isArray(data.permissions)) {
    throw new BadRequestError({
      field: 'permissions',
      error: 'Token claim "permissions" is missing or not an array',
    });
  }
  if (data.permissions.find(p => p.startsWith('vailable'))) {
    throw new BadRequestError({
      field: 'permissions',
      error: 'Claim "permissions" does not contain any vailable* permissions.',
    });
  }
  if (data.aud) {
    if (
      Array.isArray(data.aud) &&
      !data.aud.find(a => acceptedAudiences.includes(a))
    ) {
      throw new BadRequestError({
        field: 'aud',
        error: `Token claim "aud" does not include "api.vailable.eu"`,
      });
    }
    if (typeof data.aud === 'string' && !acceptedAudiences.includes(data.aud)) {
      throw new BadRequestError({
        field: 'aud',
        error: `Token claim "aud" does not contain "api.vailable.eu"`,
      });
    }
    if (!data.aud && !acceptMissingAudience) {
      throw new BadRequestError({
        field: 'aud',
        error: 'Token claim "aud" is missing',
      });
    }
    if (data.aud) {
      throw new BadRequestError({
        field: 'aud',
        error: 'Token claim "aud" is of unknown type',
      });
    }
  }
  if (data.exp) {
    if (Date.now() > data.exp * 1000) {
      throw new BadAuthenticationError(`Token is expired`);
    }
  }
  const cleanedIssuer = data.iss.startsWith('http')
    ? data.iss.split('//').reverse()[0]
    : data.iss;
  return { ...data, iss: cleanedIssuer };
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
): Promise<APITokenData> {
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

export async function verifyAPIToken(apiToken: string): Promise<APITokenData> {
  const data = mapToAPIToken(apiToken);
  if (data.iss === config.jwt.issuer) {
    return verify<APITokenData>(apiToken);
  }
  const keyStore = await getKeyStore(data.iss);
  return getAPITokenData(keyStore, apiToken);
}
