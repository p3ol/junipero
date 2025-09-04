import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'old',
    '^.+\\.stories.tsx$',
    '^.+\\.styl$',
  ],
  projects: [
    '<rootDir>/packages/core/jest.config.ts',
    '<rootDir>/packages/hooks/jest.config.ts',
    '<rootDir>/packages/react/jest.config.ts',
    '<rootDir>/packages/react-d3-plugin/jest.config.ts',
    '<rootDir>/packages/tailwind-plugin/jest.config.ts',
  ],
};

export default config;
