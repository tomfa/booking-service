import { Request, Response } from 'express';

type AnyJson = boolean | number | string | null | Variables | Variables[];
export interface Variables {
  [key: string]: AnyJson;
}

export type ControllerFunction = (req: Request, res: Response) => Promise<void>
