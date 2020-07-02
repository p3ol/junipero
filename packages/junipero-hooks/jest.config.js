const path = require('path');

module.exports = {
  displayName: 'junipero-hooks',
  clearMocks: true,
  rootDir: path.resolve(),
  timers: 'fake',
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testMatch: ['<rootDir>/packages/junipero-hooks/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/.ci/config/enzyme.js',
    '<rootDir>/.ci/config/popper.js',
  ],
};
