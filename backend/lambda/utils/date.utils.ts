export const fromGQLDate = (seconds: number): Date => new Date(seconds * 1000);
export const toGQLDate = (date: Date): number =>
  Math.floor(date.getTime() / 1000);
