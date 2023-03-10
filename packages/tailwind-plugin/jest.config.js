const path = require('path');

module.exports = {
  displayName: '@junipero/tailwind-plugin',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  testMatch: ['<rootDir>/packages/tailwind-plugin/lib/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testEnvironment: 'jsdom',
  snapshotResolver: '<rootDir>/.ci/config/snapshot-resolver.js',
};
