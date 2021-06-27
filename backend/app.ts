/* eslint-disable import/no-extraneous-dependencies */
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema, GraphQLError } from 'graphql';

const env = process.env.NODE_ENV;

dotenv.config({ path: env === 'test' ? '.env.test' : '.env' });

const { getDB } = require('./localDb');
const { handler } = require('./lambda');

const gqlSchema = fs.readFileSync('./graphql/schema.graphql', 'utf8');
const schema = buildSchema(gqlSchema);

const gqlHandler = (fieldName: string) => async (args: unknown) => {
  const db = await getDB();
  try {
    return await handler(
      { info: { fieldName }, arguments: args },
      {},
      undefined,
      db
    );
  } catch (err) {
    throw new GraphQLError(err.message, null, null, null, null, err, {
      code: err.code || err.httpCode || 'unknown',
      type: err.errorCode,
    });
  }
};

const createApp = () => {
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
    deleteCustomer: gqlHandler('deleteCustomer'),
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
  return runningApp;
};

export default createApp;
