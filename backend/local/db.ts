import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

export const getDB = async (): Promise<PrismaClient> => {
  if (db) return db;

  const url = process.env.DATABASE_URL;

  db = new PrismaClient({
    datasources: { db: { url } },
    __internal: {
      // @ts-ignore
      useUds: false,
    },
  });
  return db;
};
