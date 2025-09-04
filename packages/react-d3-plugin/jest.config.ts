import path from 'node:path';

import type { Config } from 'jest';

process.env.TZ = 'UTC';

const config: Config = {
  displayName: '@junipero/react-d3-plugin',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  transform: {
    '^.+\\.m?(t|j)sx?$': [
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
  testMatch: ['<rootDir>/packages/react-d3-plugin/lib/**/*.test.tsx'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(' +
      // thx d3
      'd3|d3-array|internmap|delaunator|robust-predicates' +
    '))',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [],
  snapshotResolver: '<rootDir>/.ci/config/snapshot-resolver.js',
};

export default config;
