export default {
  testPathForConsistencyCheck: 'TextField/index.test.js',
  resolveSnapshotPath: (path: string, ext: string) => path + ext,
  resolveTestPath: (path: string, ext: string) => path.slice(0, -ext.length),
};
