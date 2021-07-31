/* eslint-disable import/first */
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV === 'test'
      ? path.join(__dirname, '../.env.test')
      : path.join(__dirname, '../.env'),
});

import { Request, Response } from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { ApolloServer } from 'apollo-server-cloud-functions';
import { resolvers } from './graphql/resolvers';
import { RequestContext } from './types';

admin.initializeApp();

const firestore = admin.firestore();
fireorm.initialize(firestore);

const schemaPath = path.join(__dirname, '../schema.graphql');
const gqlSchema = fs.readFileSync(schemaPath, 'utf8');

const server = new ApolloServer({
  typeDefs: gqlSchema,
  // @ts-ignore
  resolvers,
  formatError: err => {
    console.log(err);
    return err;
  },
  introspection: true,
  playground: true,
  context: ({ req, res }: { req: Request; res: Response }): RequestContext => ({
    headers: req.headers,
    config: process.env,
  }),
});

const handler = server.createHandler({
  cors: { origin: true, credentials: true },
});

exports.graphql = functions.region('europe-central2').https.onRequest(handler);
