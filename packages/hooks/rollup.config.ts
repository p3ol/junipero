import path from 'node:path';

import swc from '@rollup/plugin-swc';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const input = './lib/index.ts';
const output = './dist';
const name = 'junipero-hooks';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = [
  'react', 'react-dom',
];
const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

const defaultPlugins = [
  commonjs(),
  resolve({
    rootDir: path.resolve('../../'),
    extensions: ['.js', '.ts', '.json', '.node'],
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
    output: {
      format: f,
      ...f === 'esm' ? {
        dir: `${output}/esm`,
        chunkFileNames: '[name].js',
      } : {
        file: `${output}/${name}.${f}.js`,
      },
      ...f === 'esm' ? {
        manualChunks: (id: string) =>
          id.includes('node_modules') ? 'vendor' : path.parse(id).name,
      } : {},
      name,
      sourcemap: true,
      globals: defaultGlobals,
    },
    external: defaultExternals,
  })),
];
