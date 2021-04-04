export type JSONValue =
  | boolean
  | number
  | string
  | null
  | JSONValue[]
  | JSONObject;

export type JSONObject = {
  [key: string]: JSONValue;
};
