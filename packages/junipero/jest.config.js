const path = require('path');

module.exports = {
  displayName: 'junipero',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  moduleNameMapper: {
    '^@poool/junipero-(.+)$': '<rootDir>/packages/junipero-$1/lib/index.js',
    '^~test-utils$': '<rootDir>/.ci/config/utils.js',
  },
  testMatch: ['<rootDir>/packages/junipero/lib/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/old/',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/.ci/config/popper.js',
  ],
};
