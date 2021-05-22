/* eslint-disable unused-imports/no-unused-vars */
import * as Express from 'express';
import { getUser } from './request.utils';

export const authMiddleware = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  // @ts-ignore
  req.user = getUser(req);
  next();
};
