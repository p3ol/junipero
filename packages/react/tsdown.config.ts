import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts'],
    platform: 'browser',
    outDir: 'dist',
    format: ['cjs', 'esm'],
    target: pkg.targets,
    external: [
      'react',
      'react-dom',
    ],
    sourcemap: true,
    dts: false,
  },
]);
