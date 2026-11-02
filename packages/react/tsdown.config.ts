import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts'],
    platform: 'browser',
    outDir: 'dist',
    format: ['cjs', 'esm'],
    target: pkg.targets,
    deps: {
      neverBundle: [
        'react',
        'react-dom',
      ],
    },
    banner: "'use client';",
    sourcemap: true,
    dts: false,
    inputOptions: {
      platform: 'browser',
    },
  },
]);
