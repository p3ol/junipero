const path = require('path');

module.exports = {
  displayName: '@junipero/hooks',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  testMatch: ['<rootDir>/packages/hooks/lib/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testEnvironment: 'jsdom',
};
