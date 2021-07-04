import { gql } from 'apollo-server-cloud-functions';

export const typeDefs = gql`
  type Customer {
    id: String!
    name: String
    email: String
    phoneNumber: String
    issuer: String
    credits: Int!
    enabled: Boolean!
  }
  type Query {
    customers: [Customer]
  }
`;
