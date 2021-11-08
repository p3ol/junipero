const path = require('path');

module.exports = {
  displayName: 'junipero',
  clearMocks: true,
  rootDir: path.resolve(),
  timers: 'real',
  moduleNameMapper: {
    '^@poool/junipero-(.+)$': '<rootDir>/packages/junipero-$1/lib/index.js',
  },
  testMatch: ['<rootDir>/packages/junipero/lib/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/old/',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/.ci/config/enzyme.js',
    '<rootDir>/.ci/config/popper.js',
  ],
};
