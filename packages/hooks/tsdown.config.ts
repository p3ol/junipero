import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts'],
    outDir: 'dist',
    target: pkg.targets,
    platform: 'browser',
    format: ['cjs', 'esm'],
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
