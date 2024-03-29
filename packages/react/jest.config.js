const path = require('path');

module.exports = {
  displayName: '@junipero/react',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  moduleNameMapper: {
    '^@junipero/(.+)$': '<rootDir>/packages/$1/lib/index.js',
    '^~tests?-utils$': '<rootDir>/packages/react/tests/utils.js',
  },
  testMatch: ['<rootDir>/packages/react/lib/**/*.test.js'],
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
