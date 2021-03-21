import { isValidBase64, decodeBase64, encodeBase64 } from './encoding';

describe('encoding.utils', () => {
  describe('isValidBase64', () => {
    test('returns true if valid base64', () => {
      expect(isValidBase64('Q2hlZXNl')).toBe(true);
    });
    test('returns true for empty string', () => {
      expect(isValidBase64('')).toBe(true);
    });
    test('returns false if string has non-b64 characters', () => {
      expect(isValidBase64('å')).toBe(false);
      expect(isValidBase64('!')).toBe(false);
    });
  });

  describe('decodeBase64', () => {
    test('decodes base64 encoded string to utf-8', () => {
      expect(decodeBase64('Q2hlZXNl')).toBe('Cheese');
    });

    test('handles url cleaned base64', () => {
      const urlUnsafeValue = 'PGJvZHk+PGgxPnt7IG5hbWUgfX08L2gxPjwvYm9keT4';
      const urlSafeValue = urlUnsafeValue.replace('+', '_');
      expect(decodeBase64(urlSafeValue)).toBe(decodeBase64(urlUnsafeValue));
      expect(decodeBase64(urlSafeValue)).toBe(
        '<body><h1>{{ name }}</h1></body>'
      );
    });
  });

  describe('encodeBase64', () => {
    test('encodes utf-8 string to base64', () => {
      expect(encodeBase64('Cheese')).toBe('Q2hlZXNl');
    });
  });
});
