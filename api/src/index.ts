import fs from 'fs';
import path from 'path';
import * as admin from 'firebase-admin';
import { ApolloServer } from 'apollo-server-cloud-functions';
import { resolvers } from './graphql/resolvers';

admin.initializeApp();

const schemaPath = path.join(__dirname, './graphql/schema.graphql');
const gqlSchema = fs.readFileSync(schemaPath, 'utf8');

const server = new ApolloServer({
  typeDefs: gqlSchema,
  // @ts-ignore
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req, res }) => ({
    headers: req.headers,
    req,
    res,
  }),
});

export const handler = server.createHandler({
  cors: { origin: true, credentials: true },
});
