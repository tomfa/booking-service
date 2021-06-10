/* eslint-disable unused-imports/no-unused-vars */
import * as Express from 'express';
import { getUser } from './request.utils';

export const authMiddleware = async (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  // @ts-ignore
  req.user = await getUser(req);
  next();
};
