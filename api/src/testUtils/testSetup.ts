import * as nock from 'nock';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

jest.setTimeout(10000); // We are dealing with PDFs and buffer things

const disableHttpRequests = () => {
  nock.disableNetConnect();
  nock.enableNetConnect(/localhost|(127\.0\.0\.1)/);
};

beforeAll(async () => {
  disableHttpRequests();
});
