const path = require('path');

module.exports = {
  displayName: 'junipero',
  clearMocks: true,
  rootDir: path.resolve(),
  timers: 'fake',
  moduleNameMapper: {
    '^@poool/junipero-(.+)$': '<rootDir>/packages/junipero-$1/lib/index.js',
  },
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testMatch: ['<rootDir>/packages/junipero/lib/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/old/',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/.ci/config/enzyme.js',
    '<rootDir>/.ci/config/popper.js',
  ],
};
