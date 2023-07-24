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
    '<rootDir>/packages/react/jest.config.js',
    '<rootDir>/packages/react-d3-plugin/jest.config.js',
    '<rootDir>/packages/react-native/jest.config.js',
    '<rootDir>/packages/tailwind-plugin/jest.config.js',
  ],
};
