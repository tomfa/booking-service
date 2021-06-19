import { PrismaClient } from '@prisma/client';

let localDb: PrismaClient;

export const getDB = async (): Promise<PrismaClient> => {
  if (localDb) return localDb;

  const url = process.env.DATABASE_URL;
  console.log(`Starting database connection to ${url}`);

  localDb = new PrismaClient({
    datasources: { db: { url } },
    __internal: {
      // @ts-ignore
      useUds: false,
    },
  });
  return localDb;
};

export const close = async () => {
  const db = await getDB();
  await db.$disconnect();
};
