import { AuthToken } from './types';

export const getVerifiedTokenData = (authHeader: string): AuthToken => {
  const token = authHeader.split(' ').reverse()[0];
  // TODO: Implement
  const customerId: string = token.split('-')[0];

  return {
    sub: (token.includes('-') && token.split('-').reverse()[0]) || null,
    customerId,
  };
};
