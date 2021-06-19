import ApolloClient from 'apollo-boost';

export const client = new ApolloClient({
  uri: `http://${process.env.GRAPHQL_ENDPOINT}:${process.env.GRAPHQL_PORT}/graphql`,
  onError: e => {
    console.log(e);
  },
});
