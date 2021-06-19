import { getDB } from './db';

const fs = require('fs');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

require.extensions['.graphql'] = (module, filename) => {
  // eslint-disable-next-line no-param-reassign
  module.exports = fs.readFileSync(filename, 'utf8');
};

const gqlSchema = require('../graphql/schema.graphql');
const { handler } = require('../lambda/index');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(gqlSchema);

// The root provides a resolver function for each API endpoint
const root = {
  getResourceById: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'getResourceById' }, arguments: args },
        {},
        db
      )
    ),
  getBookingById: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'getBookingById' }, arguments: args },
        {},
        db
      )
    ),
  getCustomerByIssuer: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'getCustomerByIssuer' }, arguments: args },
        {},
        db
      )
    ),
  getCustomerByEmail: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'getCustomerByEmail' }, arguments: args },
        {},
        db
      )
    ),
  getCustomerById: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'getCustomerById' }, arguments: args },
        {},
        db
      )
    ),
  findResources: async (args: unknown) =>
    getDB().then(db =>
      handler({ info: { fieldName: 'findResources' }, arguments: args }, {}, db)
    ),
  findBookings: async (args: unknown) =>
    getDB().then(db =>
      handler({ info: { fieldName: 'findBookings' }, arguments: args }, {}, db)
    ),
  findAvailability: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'findAvailability' }, arguments: args },
        {},
        db
      )
    ),
  getNextAvailable: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'getNextAvailable' }, arguments: args },
        {},
        db
      )
    ),
  getLatestBooking: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'getLatestBooking' }, arguments: args },
        {},
        db
      )
    ),
  getBookedDuration: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'getBookedDuration' }, arguments: args },
        {},
        db
      )
    ),
  addResource: async (args: unknown) =>
    getDB().then(db =>
      handler({ info: { fieldName: 'addResource' }, arguments: args }, {}, db)
    ),
  updateResource: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'updateResource' }, arguments: args },
        {},
        db
      )
    ),
  updateCustomer: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'updateCustomer' }, arguments: args },
        {},
        db
      )
    ),
  addBooking: async (args: unknown) =>
    getDB().then(db =>
      handler({ info: { fieldName: 'addBooking' }, arguments: args }, {}, db)
    ),
  disableResource: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'disableResource' }, arguments: args },
        {},
        db
      )
    ),
  cancelBooking: async (args: unknown) =>
    getDB().then(db =>
      handler({ info: { fieldName: 'cancelBooking' }, arguments: args }, {}, db)
    ),
  addCustomer: async (args: unknown) =>
    getDB().then(db =>
      handler({ info: { fieldName: 'addCustomer' }, arguments: args }, {}, db)
    ),
  disableCustomer: async (args: unknown) =>
    getDB().then(db =>
      handler(
        { info: { fieldName: 'disableCustomer' }, arguments: args },
        {},
        db
      )
    ),
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
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
