const path = require('path');

module.exports = {
  displayName: '@junipero/react-native',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  preset: 'react-native',
  moduleNameMapper: {
    '^@junipero/(.+)$': '<rootDir>/packages/$1/lib/index.js',
  },
  testMatch: ['<rootDir>/packages/react-native/lib/**/*.test.js'],
  testPathIgnorePatterns: [
    'node_modules',
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    'theme',
    '^.+\\.stories.js$',
    '^.+\\.styles.js$',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/.ci/config/react-native.js',
  ],
};
