import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts?(x)'],
    environment: 'jsdom',
    globals: true,
    resolveSnapshotPath: (testPath: string, snapExtension: string) =>
      testPath + snapExtension,
    alias: {
      '@junipero/core': path.resolve('./packages/core/lib'),
      '@junipero/react': path.resolve('./packages/react/lib'),
      '@junipero/transitions': path.resolve('./packages/transitions/lib'),
    },
  },
});
