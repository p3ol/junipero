const path = require('path');

module.exports = {
  displayName: '@junipero/react-d3-plugin',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  moduleNameMapper: {
    '^@junipero/(.+)$': '<rootDir>/packages/$1/lib/index.js',
    '^~tests?-utils$': '<rootDir>/packages/react-d3-plugin/tests/utils.js',
  },
  testMatch: ['<rootDir>/packages/react-d3-plugin/lib/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [],
  snapshotResolver: '<rootDir>/.ci/config/snapshot-resolver.js',
};
