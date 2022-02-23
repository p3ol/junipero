const path = require('path');

module.exports = {
  displayName: 'junipero-utils',
  clearMocks: true,
  rootDir: path.resolve(),
  timers: 'real',
  moduleNameMapper: {
    '^@poool/junipero-(.+)$': '<rootDir>/packages/junipero-$1/lib/index.js',
  },
  testMatch: ['<rootDir>/packages/junipero-utils/lib/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/.ci/config/popper.js',
  ],
};
