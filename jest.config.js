module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'old',
    '^.+\\.stories.js$',
    '^.+\\.styl$',
  ],
  projects: [
    '<rootDir>/packages/core/jest.config.js',
    '<rootDir>/packages/hooks/jest.config.js',
    '<rootDir>/packages/junipero/jest.config.js',
    '<rootDir>/packages/junipero-native/jest.config.js',
  ],
};
