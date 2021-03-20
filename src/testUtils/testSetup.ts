import * as nock from 'nock';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const disableHttpRequests = () => {
  nock.disableNetConnect();
  nock.enableNetConnect(/localhost|(127\.0\.0\.1)/);
};

beforeAll(async () => {
  disableHttpRequests();
});
