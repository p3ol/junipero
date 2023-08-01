const path = require('path');

process.env.TZ = 'UTC';

module.exports = {
  displayName: '@junipero/react-d3-plugin',
  clearMocks: true,
  rootDir: path.resolve(),
  fakeTimers: {
    enableGlobally: false,
  },
  moduleNameMapper: {
    '^@junipero/(.+)$': '<rootDir>/packages/$1/lib/index.js',
    '^~tests?-utils$': '<rootDir>/packages/react-d3-plugin/tests/utils.js',
  },
  testMatch: ['<rootDir>/packages/react-d3-plugin/lib/**/*.test.js'],
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
