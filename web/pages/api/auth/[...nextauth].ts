/* eslint-disable no-param-reassign, unused-imports/no-unused-vars */
import NextAuth, { Account, Profile, Session, User } from 'next-auth';
import Providers from 'next-auth/providers';
import { JWT } from 'next-auth/jwt';

// Example: https://github.com/nextauthjs/next-auth-example/blob/main/pages/api/auth/%5B...nextauth%5D.js

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
    async session(session: Session, token) {
      return {
        ...token,
        user: {
          email: token.email,
          name: token.name,
          image: token.picture as string,
        },
      };
    },
    async jwt(
      token: JWT,
      user: User | undefined,
      account: Account | undefined,
      profile: Profile | undefined,
      isNewUser: boolean | undefined
    ) {
      token.iss = 'api.vailable.eu';
      token.aud = ['api.vailable.eu', 'https://vailable.eu'];
      token.role = 'admin';
      if (!token.email) {
        throw new Error(`Unable to log in without email`);
      }
      token.sub = token.email;
      return token;
    },
  },
});
