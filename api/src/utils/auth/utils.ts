import * as Express from 'express';
import { User } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getUser = (req: Express.Request): User | undefined => {
  // TODO: Make it real
  return {
    username: 'kroloftet',
  };
};

export const authMiddleware = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  try {
    // @ts-ignore
    req.user = getUser(req);
  } catch {
    // @ts-ignore
    req.user = null;
  }
  next();
};
