// eslint-disable-next-line import/no-extraneous-dependencies
import * as nock from 'nock';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// eslint-disable-next-line import/first
import { getDB } from '../localDb';

const disableHttpRequests = () => {
  nock.disableNetConnect();
  nock.enableNetConnect(/localhost|(127\.0\.0\.1)/);
};

const clearDatabase = async () => {
  const db = await getDB();
  await db.booking.deleteMany();
  await db.resource.deleteMany();
  await db.customer.deleteMany();
};

beforeAll(async () => {
  await clearDatabase();
  disableHttpRequests();
});

beforeEach(clearDatabase);
