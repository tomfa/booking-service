import { Request, Response } from 'express';
import { JSONValue } from '@booking-service/shared';

export interface Variables {
  [key: string]: JSONValue;
}

export type ControllerFunction = (
  req: Request,
  res: Response
) => Promise<unknown>;
