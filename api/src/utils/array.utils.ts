export function getRandomFrom<T = unknown>(list: T[]): T {
  if (!list.length) {
    throw new Error(`Can not return random from empty list`);
  }
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
