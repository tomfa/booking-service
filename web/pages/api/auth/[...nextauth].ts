/* eslint-disable no-param-reassign, unused-imports/no-unused-vars */
import NextAuth, { Account, Profile, Session, User } from 'next-auth';
import Providers from 'next-auth/providers';
import { JWT } from 'next-auth/jwt';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createJWTtoken } from '../../../auth/jwt';
import { config } from '../../../config';
import {
  Customer,
  GetCustomerByEmailDocument,
  GetCustomerByEmailQuery,
  GetCustomerByEmailQueryVariables,
} from '../../../graphql/generated/types';

// Example: https://github.com/nextauthjs/next-auth-example/blob/main/pages/api/auth/%5B...nextauth%5D.js

function generateSuperUserToken() {
  return createJWTtoken('hi@6040.work', ['*']);
}

async function queryCustomerByEmail(
  email: string
): Promise<GetCustomerByEmailQuery> {
  const client = new ApolloClient({
    uri: config.GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    headers: { Authorization: generateSuperUserToken() },
  });
  const user = await client.query<
    GetCustomerByEmailQuery,
    GetCustomerByEmailQueryVariables
  >({ query: GetCustomerByEmailDocument, variables: { email } });
  return user.data;
}

function generateCustomerToken(user: Customer) {
  if (!user.email) {
    throw new Error(`User ${user.id} has no email!`);
  }
  return createJWTtoken(user.email, ['role:admin']);
}

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
  ],
  secret: process.env.JWT_SECRET,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async session(session: Session, token: JWT & { apiToken: string }) {
      return {
        apiToken: token.apiToken,
        user: {
          email: token.email,
          name: token.name,
          image: token.picture as string,
        },
      };
    },
    async jwt(
      token: JWT,
      authUser: User | undefined,
      account: Account | undefined,
      profile: Profile | undefined,
      isNewUser: boolean | undefined
    ) {
      if (!token.email) {
        throw new Error(`Unable to log in without email`);
      }

      const result = await queryCustomerByEmail(token.email);
      const user = result && result.getCustomerByEmail;
      if (!user) {
        // TODO: Consider automatically signing up here.
        throw new Error(`Unknown user`);
      }
      const authToken = generateCustomerToken(user);

      token.email = user.email;
      token.apiToken = authToken;
      token.name = user.name;
      return token;
    },
  },
});
