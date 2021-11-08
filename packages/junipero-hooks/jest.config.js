const path = require('path');

module.exports = {
  displayName: 'junipero-hooks',
  clearMocks: true,
  rootDir: path.resolve(),
  timers: 'real',
  moduleNameMapper: {
    '^@poool/junipero-(.+)$': '<rootDir>/packages/junipero-$1/lib/index.js',
  },
  testMatch: ['<rootDir>/packages/junipero-hooks/lib/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/.ci/config/enzyme.js',
    '<rootDir>/.ci/config/popper.js',
  ],
};
