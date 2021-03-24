export type JSONValue = boolean | number | string | null | JSONValue[];

export type JSONObject = {
  [key: string]: JSONValue;
};
