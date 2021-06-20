import ApolloClient, { DocumentNode } from 'apollo-boost';

export const client = new ApolloClient({
  uri: `http://${process.env.GRAPHQL_ENDPOINT}:${process.env.GRAPHQL_PORT}/graphql`,
  onError: e => {
    console.log(e);
  },
});

client.defaultOptions = {
  watchQuery: { errorPolicy: 'all' },
  mutate: { errorPolicy: 'all' },
};

export const mutate = (mutation: DocumentNode) => client.mutate({ mutation });
export const query = (q: DocumentNode, variables?: unknown) =>
  client.query({ query: q, variables });
