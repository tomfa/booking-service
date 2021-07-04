import * as admin from 'firebase-admin';
import { ApolloServer } from 'apollo-server-cloud-functions';
import { typeDefs } from './graphql/typedefs';
import { resolvers } from './graphql/resolvers';

const serviceAccount = require('../service-account.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const server = new ApolloServer({
  typeDefs,
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
