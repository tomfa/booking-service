import ApolloClient, { DocumentNode } from 'apollo-boost';

export const client = new ApolloClient({
  uri: `http://${process.env.GRAPHQL_ENDPOINT}:${process.env.GRAPHQL_PORT}/graphql`,
  headers: { authorization: 'testUser' },
  onError: () => {},
});

client.defaultOptions = {
  watchQuery: { errorPolicy: 'all' },
  mutate: { errorPolicy: 'all' },
  query: { errorPolicy: 'all' },
};

export const mutate = (mutation: DocumentNode, variables?: unknown) =>
  client.mutate({ mutation, variables });
export const query = (q: DocumentNode, variables?: unknown) =>
  client.query({ query: q, variables });
