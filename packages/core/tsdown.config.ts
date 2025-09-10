import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts'],
    platform: 'neutral',
    outDir: 'dist',
    format: ['cjs', 'esm'],
    target: pkg.targets,
    external: [],
    sourcemap: true,
    dts: false,
  },
]);
