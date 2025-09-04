import path from 'node:path';

import type { Config } from 'jest';

const config: Config = {
  displayName: '@junipero/hooks',
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
  moduleNameMapper: {
    '^@junipero/(.+)$': '<rootDir>/packages/$1/lib/index.js',
    '^~tests?-utils$': '<rootDir>/packages/react/tests/utils.ts',
  },
  testMatch: ['<rootDir>/packages/hooks/lib/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testEnvironment: 'jsdom',
  snapshotResolver: '<rootDir>/.ci/config/snapshot-resolver.js',
};

export default config;
