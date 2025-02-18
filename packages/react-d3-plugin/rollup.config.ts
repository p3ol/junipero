import path from 'node:path';

import swc from '@rollup/plugin-swc';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';

const input = './lib/index.ts';
const output = './dist';
const name = 'junipero-react-d3-plugin';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = [
  'react', 'react-dom', '@junipero/react',
];
const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@junipero/react': 'JuniperoReact',
};

const defaultPlugins = [
  commonjs({ include: /node_modules/ }),
  alias({
    entries: {
      '@junipero/react': path.resolve('../react'),
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
    external: [
      ...defaultExternals,
      'd3',
    ],
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
      globals: {
        ...defaultGlobals,
        d3: 'd3',
      },
      ...(f === 'esm' ? {
        manualChunks: (id: string) => {
          if (/packages\/react-d3-plugin\/lib\/(\w+)\/index.ts/.test(id)) {
            return path.parse(id).dir.split('/').pop();
          } else if (id.includes('packages/core')) {
            return 'core';
          } else if (id.includes('packages/hooks')) {
            return 'hooks';
          } else if (id.includes('packages/react/')) {
            return 'react';
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
