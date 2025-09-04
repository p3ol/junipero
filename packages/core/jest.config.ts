import path from 'node:path';

import type { Config } from 'jest';

const config: Config = {
  displayName: '@junipero/core',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        env: {},
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
  testMatch: ['<rootDir>/packages/core/lib/**/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testEnvironment: 'jsdom',
  snapshotResolver: '<rootDir>/.ci/config/snapshot-resolver.js',
};

export default config;
