import {
  decode,
  encode,
  isValidUrlSafeBase64,
  decodeUrlSafeBase64,
  encodeUrlSafeBase64,
} from './base64';

describe('encoding.utils', () => {
  describe('isValidBase64', () => {
    test('returns true if valid base64', () => {
      expect(isValidUrlSafeBase64('Q2hlZXNl')).toBe(true);
    });
    test('returns true for empty string', () => {
      expect(isValidUrlSafeBase64('')).toBe(true);
    });
    test('returns false if string has non-b64 characters', () => {
      expect(isValidUrlSafeBase64('å')).toBe(false);
      expect(isValidUrlSafeBase64('!')).toBe(false);
    });
  });

  describe('decodeBase64', () => {
    test('decodes base64 encoded string to utf-8', () => {
      expect(decodeUrlSafeBase64('Q2hlZXNl')).toBe('Cheese');
    });

    test('handles url cleaned base64', () => {
      const urlUnsafeValue = 'PGJvZHk+PGgxPnt7IG5hbWUgfX08L2gxPjwvYm9keT4';
      const urlSafeValue = urlUnsafeValue.replace('+', '_');
      expect(decodeUrlSafeBase64(urlSafeValue)).toBe(
        decodeUrlSafeBase64(urlUnsafeValue)
      );
      expect(decodeUrlSafeBase64(urlSafeValue)).toBe(
        '<body><h1>{{ name }}</h1></body>'
      );
    });
  });

  describe('encodeBase64', () => {
    test('encodes utf-8 string to base64', () => {
      expect(encodeUrlSafeBase64('Cheese')).toBe('Q2hlZXNl');
    });
  });
});

describe('decode', () => {
  it('decodes a base64 string to a utf-8 string', () => {
    const data = 'fish';
    const b64 = encode(data);
    expect(b64).toBe('ZmlzaA==');
    expect(decode(b64)).toBe(data);
  });
});
