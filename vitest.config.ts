import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts?(x)'],
    environment: 'jsdom',
    globals: true,
    resolveSnapshotPath: (testPath: string, snapExtension: string) =>
      testPath + snapExtension,
    coverage: {
      provider: 'v8',
      exclude: [
        'storybook-static',
        '.turbo',
        '.storybook',
        '.yarn',
        '*.d.ts',
        '*.config.ts',
        '*.config.js',
        '**/dist',
        '**/test?(s)',
        '**/script?(s)',
        '**/.turbo',
        '**/*.d.ts',
        '**/*.stories.tsx',
        '**/*.config.ts',
        '**/*.config.js',
      ],
    },
    alias: {
      '@junipero/core': path.resolve('./packages/core/lib'),
      '@junipero/react': path.resolve('./packages/react/lib'),
      '@junipero/transitions': path.resolve('./packages/transitions/lib'),
    },
  },
});
