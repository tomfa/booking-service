import { cache } from './memoryCache';

describe('cache', () => {
  it('returns undefined if cache does not contain key', () => {
    expect(cache.get('whatever')).toBe(undefined);
  });
  it('returns undefined if cache has expired', () => {
    const key = 'cake';
    cache.set({ key, value: 'cheese', expiresAfterMinutes: 0 });

    expect(cache.get(key)).toBe(undefined);
  });
  it('returns value if cache has not expired', () => {
    const key = 'cake';
    const value = 'cheese';
    cache.set({ key, value, expiresAfterMinutes: 1 });

    expect(cache.get(key)).toBe(value);
  });
});
