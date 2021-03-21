import { NextFunction, Request, Response } from 'express';
import { ControllerFunction } from '../types';
import config from '../config';
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
      .json({
        errors: err.errors,
        message: err.displayMessage,
        error: err.name,
        status: err.httpCode,
      });
  } else {
    if (config.isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
    const safeErrorMessage = 'Internal Server Error';
    const displayOriginalError = config.isDevelopment || config.isTest;
    const message = displayOriginalError && err.message || safeErrorMessage;
    res
      .status(500)
      .json({
        errors: [],
        message,
        error: 'Internal Server Error',
        status: 500,
      });
  }
};
