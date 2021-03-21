import { NextFunction, Request, Response } from 'express';
import { ControllerFunction } from '../types';
import { APIError } from './errors/APIError';

export const errorWrapper = (fun: ControllerFunction) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await fun(req, res);
  } catch (err) {
    next(err);
  }
};

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof APIError) {
    res
      .status(err.httpCode)
      .json({ errors: err.errors, message: err.displayMessage });
  } else {
    // TODO: Hide error message outside dev and test
    res.status(500).json({ errors: [err.message], message: err.message });
  }
};
