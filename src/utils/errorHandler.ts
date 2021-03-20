import { Request, Response, NextFunction } from 'express';
import { APIError } from './errors/APIError';

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
