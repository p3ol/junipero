const path = require('path');

module.exports = {
  displayName: 'junipero-utils',
  clearMocks: true,
  rootDir: path.resolve(),
  timers: 'fake',
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testMatch: ['<rootDir>/packages/junipero-utils/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/.ci/config/enzyme.js',
    '<rootDir>/.ci/config/popper.js',
  ],
};
