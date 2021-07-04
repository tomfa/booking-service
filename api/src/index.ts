import fs from 'fs';
import * as admin from 'firebase-admin';
import { ApolloServer } from 'apollo-server-cloud-functions';
import { resolvers } from './graphql/resolvers';

admin.initializeApp();

const gqlSchema = fs.readFileSync('./graphql/schema.graphql', 'utf8');

const server = new ApolloServer({
  typeDefs: gqlSchema,
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
