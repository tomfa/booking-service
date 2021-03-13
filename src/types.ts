type AnyJson = boolean | number | string | null | Variables | Variables[];
export interface Variables {
  [key: string]: AnyJson;
}
