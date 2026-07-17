/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Force the rule-engine fallback path so tests are fast & deterministic.
  // The live Gemma 26B integration is validated manually / in staging.
  setupFiles: ['<rootDir>/jest.setup.js'],
};
