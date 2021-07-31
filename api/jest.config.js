module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  setupFiles: ['./tests/globalSetup.ts'],
  coverageDirectory: '../public/api/coverage',
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/generated/**',
  ],
  modulePathIgnorePatterns: ['dist', 'lib'],
};
