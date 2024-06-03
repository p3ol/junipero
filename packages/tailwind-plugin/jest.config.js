const path = require('path');

process.env.TZ = 'UTC';

module.exports = {
  displayName: '@junipero/tailwind-plugin',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@junipero/transitions': '<rootDir>/packages/transitions/lib/index.tsx',
    '^@junipero/(.+)$': '<rootDir>/packages/$1/lib/index.ts',
  },
  testMatch: ['<rootDir>/packages/tailwind-plugin/lib/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testEnvironment: 'jsdom',
  snapshotResolver: '<rootDir>/.ci/config/snapshot-resolver.js',
};
