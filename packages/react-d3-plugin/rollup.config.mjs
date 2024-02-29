import path from 'path';
import fs from 'node:fs';

import swc from '@rollup/plugin-swc';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
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
              jsx: true,
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
        manualChunks: id => {
          if (/packages\/react-d3-plugin\/lib\/(\w+)\/index.ts/.test(id)) {
            return path.parse(id).dir.split('/').pop();
          } else if (/packages\/core/.test(id)) {
            return 'core';
          } else if (/packages\/hooks/.test(id)) {
            return 'hooks';
          } else if (/packages\/react\//.test(id)) {
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
  {
    input: './lib/index.ts',
    output: [{ file: `./dist/${name}.d.ts`, format: 'es' }],
    external: [
      ...defaultExternals,
      'd3',
    ],
    plugins: [
      typescript({
        emitDeclarationOnly: true,
        declaration: true,
        declarationDir: './types',
        tsconfig: path.resolve('./tsconfig.json'),
        outputToFilesystem: true,
        incremental: false,
        jsx: 'react-jsx',
        include: ['lib/**/*.ts', 'lib/**/*.tsx'],
        exclude: [
          '**/*.stories.tsx',
          '**/*.test.ts',
          '**/tests/**/*',
          'node_modules/**/*',
        ],
      }),
      ...defaultPlugins,
      {
        writeBundle () {
          fs.unlinkSync(`./dist/${name}.d.ts`);
        },
      },
    ],
  },
  {
    input: './dist/types/react-d3-plugin/lib/index.d.ts',
    output: [{ file: `dist/${name}.d.ts`, format: 'es' }],
    external: defaultExternals, // add d3 this if we want it out of the dts file
    plugins: [
      dts({ respectExternal: true }),
      {
        writeBundle () {
          fs.rmSync('./dist/types', { recursive: true, force: true });
        },
      },
    ],
  },
];
