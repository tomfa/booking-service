export const getRouterValueList = (
  queryValue: string | string[] | undefined
): string[] => {
  if (!queryValue) {
    return [];
  }
  if (typeof queryValue === 'string') {
    return [queryValue];
  }
  return queryValue;
};

export const getRouterValueString = (
  queryValue: string | string[] | undefined
): string | undefined => {
  if (!queryValue) {
    return undefined;
  }
  if (typeof queryValue === 'string') {
    return queryValue;
  }
  return queryValue[0];
};
