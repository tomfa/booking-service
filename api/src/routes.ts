import { Router, Request, Response } from 'express';
import { errorWrapper } from './utils/errorHandler';
import { ControllerFunction } from './types';
import { login } from './endpoints/auth/login';
import { getUserOrThrow } from './utils/auth/request.utils';

const router = Router();

const get = (url: string, fun: ControllerFunction) =>
  router.get(url, errorWrapper(fun));
const post = (url: string, fun: ControllerFunction) =>
  router.post(url, errorWrapper(fun));
const del = (url: string, fun: ControllerFunction) =>
  router.delete(url, errorWrapper(fun));

get(`/me`, async (req: Request, res: Response) => {
  const owner = getUserOrThrow(req);
  return res.json({ data: owner, message: 'OK' });
});
del(`/me`, async (req: Request, res: Response) => {
  return res.json({ data: 'No :(', message: 'OK' });
});

post('/auth/login', login);

export default router;
