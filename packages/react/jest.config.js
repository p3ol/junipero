const path = require('path');

module.exports = {
  displayName: '@junipero/react',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  moduleNameMapper: {
    '^@junipero/transitions': '<rootDir>/packages/transitions/lib/index.tsx',
    '^@junipero/(.+)$': '<rootDir>/packages/$1/lib/index.ts',
    '^~tests?-utils$': '<rootDir>/packages/react/tests/utils.js',
  },
  testMatch: ['<rootDir>/packages/react/lib/**/*.test.tsx'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/old/',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/packages/react/tests/setup.js',
  ],
  snapshotResolver: '<rootDir>/.ci/config/snapshot-resolver.js',
};
