const path = require('path');

module.exports = {
  displayName: '@junipero/core',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  testMatch: ['<rootDir>/packages/core/lib/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testEnvironment: 'jsdom',
};
