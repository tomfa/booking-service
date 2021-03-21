import { Request, Response } from 'express';

type JSONValue = boolean | number | string | null | JSONValue[];

export type JSONObject = {
  [key: string]: JSONValue;
};
export interface Variables {
  [key: string]: JSONValue;
}

export type ControllerFunction = (
  req: Request,
  res: Response
) => Promise<unknown>;

export type FileData = {
  key: string;
  filename: string;
  url: string;
  eTag?: string;
  modified?: Date;
};

export type FileDataDTO = {
  filename: string;
  url: string;
  modified: string;
};
