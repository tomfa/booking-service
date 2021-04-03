import { Readable } from 'stream';

export async function readableToString(readable: Readable): Promise<string> {
  let result = '';
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}
