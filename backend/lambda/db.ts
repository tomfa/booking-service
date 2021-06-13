import { PrismaClient } from '@prisma/client';
import { SecretsManager } from 'aws-sdk';

const sm = new SecretsManager();
let db: PrismaClient;

export const getDB = async (): Promise<PrismaClient> => {
  if (db) return db;

  const dbURL = await sm
    .getSecretValue({
      SecretId: process.env.SECRET_ARN || '',
    })
    .promise();

  const secretString = JSON.parse(dbURL.SecretString || '{}');
  const url = `postgresql://${secretString.username}:${secretString.password}@${secretString.host}:${secretString.port}/${secretString.dbname}?connection_limit=1`;

  db = new PrismaClient({
    datasources: { db: { url } },
    __internal: {
      // @ts-ignore
      useUds: false,
    },
  });
  return db;
};
