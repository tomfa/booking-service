import { PrismaClient } from '@prisma/client';

export const getDB = async (): Promise<PrismaClient> => {
  // @ts-ignore
  if (global.localDb) return global.localDb;

  const url = process.env.DATABASE_URL + `?connection_limit=5`;
  console.log(`Starting database connection to ${url}`);

  // @ts-ignore
  global.localDb = new PrismaClient({
    datasources: { db: { url } },
    __internal: {
      // @ts-ignore
      useUds: false,
    },
  });
  // @ts-ignore
  return global.localDb;
};

export const close = async () => {
  const db = await getDB();
  await db.$disconnect();
};
