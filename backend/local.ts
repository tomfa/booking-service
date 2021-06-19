// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line import/first
import * as fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv';
import * as express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { getDB } from './localDb';

const env = process.env.NODE_ENV;

dotenv.config({ path: env === 'test' ? '.env.test' : '.env' });

require.extensions['.graphql'] = (module, filename) => {
  // eslint-disable-next-line no-param-reassign
  module.exports = fs.readFileSync(filename, 'utf8');
};

const gqlSchema = require('./graphql/schema.graphql');
const { handler } = require('./lambda');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(gqlSchema);

const gqlHandler = (fieldName: string) => async (args: unknown) => {
  const db = await getDB();
  return handler({ info: { fieldName }, arguments: args }, {}, undefined, db);
};

// The root provides a resolver function for each API endpoint
const root = {
  getResourceById: gqlHandler('getResourceById'),
  getBookingById: gqlHandler('getBookingById'),
  getCustomerByIssuer: gqlHandler('getCustomerByIssuer'),
  getCustomerByEmail: gqlHandler('getCustomerByEmail'),
  getCustomerById: gqlHandler('getCustomerById'),
  findResources: gqlHandler('findResources'),
  findBookings: gqlHandler('findBookings'),
  findAvailability: gqlHandler('findAvailability'),
  getNextAvailable: gqlHandler('getNextAvailable'),
  getLatestBooking: gqlHandler('getLatestBooking'),
  getBookedDuration: gqlHandler('getBookedDuration'),
  addResource: gqlHandler('addResource'),
  updateResource: gqlHandler('updateResource'),
  updateCustomer: gqlHandler('updateCustomer'),
  addBooking: gqlHandler('addBooking'),
  disableResource: gqlHandler('disableResource'),
  cancelBooking: gqlHandler('cancelBooking'),
  addCustomer: gqlHandler('addCustomer'),
  disableCustomer: gqlHandler('disableCustomer'),
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
const runningApp = app.listen(process.env.GRAPHQL_PORT);
console.log(
  `Running a GraphQL API server at http://localhost:${process.env.GRAPHQL_PORT}/graphql`
);

export default runningApp;
