import { PrismaClient } from '@prisma/client';
import * as nock from 'nock';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// eslint-disable-next-line import/first
import { close, getDB } from '../localDb';

const disableHttpRequests = () => {
  nock.disableNetConnect();
  nock.enableNetConnect(/localhost|(127\.0\.0\.1)/);
};

let database: PrismaClient;
const getDatabase = async () => {
  if (database) {
    return database;
  }
  database = await getDB();
  return database;
};

const clearDatabase = async () => {
  const db = await getDatabase();
  await db.booking.deleteMany();
  await db.resource.deleteMany();
  await db.customer.deleteMany();
};

beforeAll(async () => {
  await clearDatabase();
  disableHttpRequests();
});

beforeEach(clearDatabase);

afterAll(async () => {
  await close();
});
