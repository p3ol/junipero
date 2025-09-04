import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./lib/index.ts'],
    outDir: 'dist',
    banner: {},
    format: ['cjs', 'esm'],
    external: [],
    sourcemap: true,
  },
]);
