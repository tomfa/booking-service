import { Request, Response } from 'express';

type JSONValue = boolean | number | string | null | Variables | Variables[];
export type JSONObject = {
  [key: string]: JSONValue;
};
export interface Variables {
  [key: string]: JSONValue;
}

export type ControllerFunction = (req: Request, res: Response) => Promise<unknown>;
