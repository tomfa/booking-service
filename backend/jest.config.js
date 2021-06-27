module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  globalSetup: './tests/globalSetup.ts',
  setupFilesAfterEnv: ['./tests/testSetup.ts'],
  collectCoverageFrom: [
    'lambda/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
  ],
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
        ignoreCodes: [2339, 2532],
      },
    },
  },
};
