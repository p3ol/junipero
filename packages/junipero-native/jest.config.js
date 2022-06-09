const path = require('path');

module.exports = {
  displayName: 'junipero-native',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  preset: 'react-native',
  moduleNameMapper: {
    '^@poool/junipero-(.+)$': '<rootDir>/packages/junipero-$1/lib/index.js',
  },
  testMatch: ['<rootDir>/packages/junipero-native/lib/**/*.test.js'],
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
