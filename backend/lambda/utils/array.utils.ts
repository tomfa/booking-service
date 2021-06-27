export const sumArray = (numbers: number[]): number =>
  numbers.reduce((prev, curr) => prev + curr, 0);

export const minArray = (numbers: number[]): number => {
  if (numbers.length === 0) {
    throw new Error(`Cannot find minimum element in empty list`);
  }
  const minimum = numbers[0];
  return numbers.reduce((prev, curr) => Math.min(prev, curr), minimum);
};
