import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts'],
    outDir: 'dist',
    target: pkg.targets,
    platform: 'browser',
    format: ['cjs', 'esm'],
    external: [
      'react',
      'react-dom',
    ],
    sourcemap: true,
    dts: false,
  },
]);
