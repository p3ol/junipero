import path from 'node:path';

import type { Config } from 'jest';

process.env.TZ = 'UTC';

const config: Config = {
  displayName: '@junipero/tailwind-plugin',
  testEnvironment: 'node',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },
  moduleNameMapper: {
    '^@junipero/transitions': '<rootDir>/packages/transitions/lib/index.tsx',
    '^@junipero/(.+)$': '<rootDir>/packages/$1/lib/index.ts',
  },
  testMatch: ['<rootDir>/packages/tailwind-plugin/lib/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  snapshotResolver: '<rootDir>/.ci/config/snapshot-resolver.ts',
};

export default config;
