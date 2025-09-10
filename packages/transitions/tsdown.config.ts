import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.tsx'],
    outDir: 'dist',
    target: pkg.targets,
    format: ['cjs', 'esm'],
    external: [
      'react',
      'react-dom',
      '@junipero/react',
    ],
    sourcemap: true,
    dts: false,
  },
]);
