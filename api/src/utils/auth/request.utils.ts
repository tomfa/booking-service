/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Express from 'express';
import { NotAuthenticatedError } from '../errors/NotAuthenticatedError';
import { User } from './types';

export const getUser = (req: Express.Request): User | null => {
  return {
    username: 'kroloftet',
  };
};

export const getUserOrThrow = (req: Express.Request): User => {
  const user = getUser(req);
  if (!user) {
    throw new NotAuthenticatedError();
  }
  return user;
};
