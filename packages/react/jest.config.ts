import path from 'node:path';

import type { Config } from 'jest';

const config: Config = {
  displayName: '@junipero/react',
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
    '^@junipero/transitions': '<rootDir>/packages/transitions/lib/index.tsx',
    '^@junipero/(.+)$': '<rootDir>/packages/$1/lib/index.ts',
    '^~tests?-utils$': '<rootDir>/packages/react/tests/utils.ts',
  },
  testMatch: ['<rootDir>/packages/react/lib/**/*.test.tsx'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/old/',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/packages/react/tests/setup.js',
  ],
  snapshotResolver: '<rootDir>/.ci/config/snapshot-resolver.js',
};

export default config;
