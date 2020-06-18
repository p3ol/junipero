const path = require('path');

module.exports = {
  displayName: 'junipero',
  clearMocks: true,
  rootDir: path.resolve(),
  timers: 'fake',
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testMatch: ['<rootDir>/packages/junipero/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/old/',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/.ci/config/enzyme.js',
    '<rootDir>/.ci/config/popper.js',
  ],
};
