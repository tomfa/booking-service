import { decode, encode } from './base64';

describe('decode', () => {
  it('decodes a base64 string to a utf-8 string', () => {
    const data = 'fish';
    const b64 = encode(data);
    expect(b64).toBe('ZmlzaA==');
    expect(decode(b64)).toBe(data);
  });
});
