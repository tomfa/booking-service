import ApolloClient, { DocumentNode } from 'apollo-boost';
import { createJWTtoken } from '../lambda/utils/token';

export const client = new ApolloClient({
  uri: `http://${process.env.GRAPHQL_ENDPOINT}:${process.env.GRAPHQL_PORT}/graphql`,
  headers: { 'x-authorization': `Bearer ${createJWTtoken('tomas')}` },
  onError: () => {},
});

client.defaultOptions = {
  watchQuery: { errorPolicy: 'all', fetchPolicy: 'no-cache' },
  mutate: { errorPolicy: 'all', fetchPolicy: 'no-cache' },
  query: { errorPolicy: 'all', fetchPolicy: 'no-cache' },
};

export const mutate = (mutation: DocumentNode, variables?: unknown) =>
  client.mutate({ mutation, variables });
export const query = (q: DocumentNode, variables?: unknown) =>
  client.query({ query: q, variables });
