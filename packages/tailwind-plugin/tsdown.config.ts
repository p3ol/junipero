import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts'],
    outDir: 'dist',
    platform: 'node',
    target: pkg.targets,
    format: ['cjs', 'esm'],
    external: [
      'tailwindcss',
      '@junipero/core',
    ],
    sourcemap: true,
    dts: false,
  },
]);
