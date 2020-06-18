module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/old/',
    '^.+\\.stories.js$',
    '^.+\\.styl$',
  ],
  projects: [
    '<rootDir>/packages/junipero/jest.config.js',
    '<rootDir>/packages/junipero-native/jest.config.js',
  ],
};
