require('dotenv').config({ path: '.env' });
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const tokenUtils = require('./lib/utils/token');
const server = require('./lib/index');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/graphql', async (req, res) => {
  try {
    return server.handler(req, res);
  } catch (e) {
    console.log(e);
  }
});
app.use('/', (req, res) => res.send('OK'));

app.listen(4000);
console.log(`Running a GraphQL API server at http://localhost:${4000}/graphql`);
const token = tokenUtils.createJWTtoken('tomas');
console.log('Token for testing');
console.log(token);
