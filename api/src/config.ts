import { getUsersFromEnv, getOriginsFromEnv } from './utils/auth/env.utils';

export const config = {
  isDevelopment: process.env.ENVIRONMENT === 'development',
  isTest: process.env.NODE_ENV === 'test',
  users: getUsersFromEnv(process.env.USER_DATA),
  allowedOrigins: getOriginsFromEnv(process.env.ALLOWED_ORIGINS),
  services: {
    s3: {
      region: process.env.AWS_BUCKET_REGION as string,
      bucketName: process.env.S3_BUCKET_NAME as string,
      endpointUrl: process.env.FILE_ENDPOINT_URL as string,
    },
  },
};

const checkHasKeyValues = (conf: Record<string, unknown>, prefix?: string) => {
  const ignoreableKeys = [];

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
