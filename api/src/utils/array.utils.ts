export function getRandomFrom<T = unknown>(list: T[]): T {
  if (!list.length) {
    throw new Error(`Can not return random from empty list`);
  }
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export const sumArray = (numbers: number[]): number =>
  numbers.reduce((prev, curr) => prev + curr, 0);

export const minArray = (numbers: number[]): number => {
  if (numbers.length === 0) {
    throw new Error(`Cannot find minimum element in empty list`);
  }
  const minimum = numbers[0];
  return numbers.reduce((prev, curr) => Math.min(prev, curr), minimum);
};
