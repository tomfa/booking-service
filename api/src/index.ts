import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ApolloServer } from 'apollo-server-cloud-functions';
import { resolvers } from './graphql/resolvers';
import { RequestContext } from './types';

admin.initializeApp();

const firestore = admin.firestore();
fireorm.initialize(firestore);

const schemaPath = path.join(__dirname, './graphql/schema.graphql');
const gqlSchema = fs.readFileSync(schemaPath, 'utf8');

const server = new ApolloServer({
  typeDefs: gqlSchema,
  // @ts-ignore
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req, res }: { req: Request; res: Response }): RequestContext => ({
    headers: req.headers,
    config: process.env,
  }),
});

export const handler = server.createHandler({
  cors: { origin: true, credentials: true },
});
