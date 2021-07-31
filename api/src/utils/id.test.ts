import { getDeterministicId, randomId } from './id';

describe('randomId', () => {
  it('returns a random id', () => {
    expect(randomId()).not.toBe(randomId());
  });
});
describe('getDeterministicId', () => {
  it('returns the same id if passed in same args', () => {
    const key1 = getDeterministicId(['a']);
    const key2 = getDeterministicId(['a']);

    expect(key1).toBe(key2);
  });
  it('returns different id if passed in different args', () => {
    const key1 = getDeterministicId(['a']);
    const key2 = getDeterministicId(['a', 'b']);

    expect(key1).not.toBe(key2);
  });
});
