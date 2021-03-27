export const IsoToDisplayDateTime = (date: string) => {
  return date.substring(0, 16).replace('T', ', ');
};
