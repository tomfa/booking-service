import { PrismaClient } from '@prisma/client';
import { SecretsManager } from 'aws-sdk';

const sm = new SecretsManager();
let db: PrismaClient;

export const getDB = async (): Promise<PrismaClient> => {
  if (db) {
    console.log('Reusing existing prisma client.');
    return db;
  }
  console.log('Creating new prisma client.');

  const dbURL = await sm
    .getSecretValue({
      SecretId: process.env.SECRET_ARN || '',
    })
    .promise();

  const connectionTimeoutSeconds = 20;
  const maxConnectionLimit = 10;
  const secretString = JSON.parse(dbURL.SecretString || '{}');
  const url = `postgresql://${secretString.username}:${secretString.password}@${secretString.host}:${secretString.port}/${secretString.dbname}?connection_limit=${maxConnectionLimit}&connect_timeout=${connectionTimeoutSeconds}`;

  db = new PrismaClient({
    datasources: { db: { url } },
    __internal: {
      // @ts-ignore
      useUds: false,
    },
  });
  return db;
};
