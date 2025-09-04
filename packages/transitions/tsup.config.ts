import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./lib/index.tsx'],
    outDir: 'dist',
    banner: {},
    format: ['cjs', 'esm'],
    external: [
      'react',
      'react-dom',
      '@junipero/react',
    ],
    sourcemap: true,
  },
]);
