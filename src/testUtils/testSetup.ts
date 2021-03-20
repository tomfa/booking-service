import * as nock from 'nock';

const disableHttpRequests = () => {
  nock.disableNetConnect();
  nock.enableNetConnect(/localhost|(127\.0\.0\.1)/);
};

beforeAll(async () => {
  disableHttpRequests();
});
