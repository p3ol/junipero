module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '^.+\\.stories.js$',
    '^.+\\.styl$',
  ],
  timers: 'fake',
  transform: {
    '^.+\\.js$': 'babel-jest',
    // '^.+\\.styl$': '<rootDir>/tests/transformers/stylus.js',
  },
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/old/',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/.ci/config/enzyme.js',
    '<rootDir>/.ci/config/popper.js',
  ],
};
