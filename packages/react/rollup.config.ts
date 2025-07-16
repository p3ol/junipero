import path from 'node:path';

import swc from '@rollup/plugin-swc';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';

const input = './lib/index.ts';
const output = './dist';
const name = 'junipero-react';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = [
  'react', 'react-dom',
];

const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

const defaultPlugins = [
  commonjs({ include: /node_modules/ }),
  alias({
    entries: {
      '@junipero/core': path.resolve('../core'),
      '@junipero/hooks': path.resolve('../hooks'),
    },
  }),
  resolve({
    rootDir: path.resolve('../../'),
    extensions: ['.js', '.ts', '.tsx', '.json', '.node'],
  }),
  terser(),
];

export default [
  ...formats.map(f => ({
    input,
    plugins: [
      swc({
        swc: {
          jsc: {
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
          },
        },
      }),
      ...defaultPlugins,
    ],
    external: defaultExternals,
    output: {
      ...(f === 'esm' ? {
        dir: `${output}/esm`,
        chunkFileNames: '[name].js',
      } : {
        file: `${output}/${name}.${f}.js`,
      }),
      format: f,
      name,
      sourcemap: true,
      globals: defaultGlobals,
      ...(f === 'esm' ? {
        manualChunks: (id: string) => {
          if (/packages\/react\/lib\/(\w+)\/index.[tj]s/.test(id)) {
            return path.parse(id).dir.split('/').pop();
          } else if (id.includes('packages/core')) {
            return 'core';
          } else if (id.includes('packages/hooks')) {
            return 'hooks';
          } else if (id.includes('node_modules')) {
            return 'vendor';
          } else {
            return path.parse(id).name;
          }
        },
      } : {}),
    },
  })),
];
