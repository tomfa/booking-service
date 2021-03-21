export interface IAPIError extends Error {
  displayMessage: string;
  httpCode: number;
  debugContext?: ErrorContext;
}

export type ErrorContext = {
  user?: {
    id: string | number;
  };
  [key: string]:
    | string
    | number
    | string[]
    | number[]
    | Record<string, string | number | string[] | number[]>;
};
