import { getOriginsFromEnv, getIssuerFromEnv } from './utils/env.utils';

export const config = {
  isDevelopment: process.env.ENVIRONMENT === 'development',
  isTest: process.env.NODE_ENV === 'test',
  allowedOrigins: getOriginsFromEnv(process.env.ALLOWED_ORIGINS),
  uuidNameSpace: process.env.UUID_NAMESPACE as string,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    audience: [
      process.env.JWT_ISSUER as string,
      ...getOriginsFromEnv(process.env.ALLOWED_ORIGINS),
    ],
    issuer: getIssuerFromEnv(process.env.JWT_ISSUER || 'api.vailable.eu'),
    permissionPrefix: 'vailable:',
  },
};

const checkHasKeyValues = (conf: Record<string, unknown>, prefix?: string) => {
  const ignoreableKeys: string[] = [];

  Object.entries(conf).forEach(([key, value]) => {
    if (['string', 'boolean', 'number'].includes(typeof value)) {
      return;
    }
    if (value instanceof Array) {
      return;
    }
    const identifiableKey = prefix ? `${prefix}.${key}` : key;
    if (ignoreableKeys.includes(identifiableKey)) {
      return;
    }
    if (typeof value === 'object') {
      return checkHasKeyValues(
        value as Record<string, unknown>,
        identifiableKey
      );
    }
    throw new Error(
      `config.${identifiableKey} has unexpected value ${value}. ` +
        `Likely missing an environment variable.`
    );
  });
};
checkHasKeyValues(config);
export type Config = typeof config;
export default config;
