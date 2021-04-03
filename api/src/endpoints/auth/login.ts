import * as Express from 'express';

import { getData } from '../utils';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { BadAuthenticationError } from '../../utils/errors/BadAuthenticatedError';
import { findUserAuthData } from '../../utils/auth/users';

export const login = async (req: Express.Request, res: Express.Response) => {
  const { username, password } = getData(req);
  if (!username) {
    throw new BadRequestError({ field: 'username', error: 'Data missing' });
  }
  if (!password) {
    throw new BadRequestError({ field: 'password', error: 'Data missing' });
  }
  const user = findUserAuthData({
    username: String(username),
    password: String(password),
  });
  if (!user) {
    throw new BadAuthenticationError();
  }
  res.json({
    message: 'OK',
    data: user,
  });
};
