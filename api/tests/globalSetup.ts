import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.test',
});

export default () => {
  console.log('...loading .env.test');
};
