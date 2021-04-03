import { getDeterministicId, getGeneratedFileId, randomId } from './id';

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
describe('getGeneratedFileId', () => {
  const userId = 'user';
  const templateId = 'templateId';
  const variables = { name: 'name', tank: 'cheese' };
  const input = { userId, templateId, variables };

  it('returns the same id if passed in same args', () => {
    const key1 = getGeneratedFileId(input);
    const key2 = getGeneratedFileId({
      ...input,
      variables: { ...input.variables },
    });

    expect(key1).toBe(key2);
  });
  it('returns different id if only user differs', () => {
    const key1 = getGeneratedFileId({ ...input, userId: 'different-user' });
    const key2 = getGeneratedFileId({ ...input });

    expect(key1).not.toBe(key2);
  });
  it('returns different id if only template differs', () => {
    const key1 = getGeneratedFileId({
      ...input,
      templateId: 'different-template',
    });
    const key2 = getGeneratedFileId({ ...input });

    expect(key1).not.toBe(key2);
  });
  it('returns different id if only 1 variable differs', () => {
    const key1 = getGeneratedFileId({
      ...input,
      variables: { ...input.variables, extra: 'cracker' },
    });
    const key2 = getGeneratedFileId({ ...input });

    expect(key1).not.toBe(key2);
  });
});
