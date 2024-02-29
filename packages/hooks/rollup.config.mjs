import path from 'path';
import fs from 'node:fs';

import swc from '@rollup/plugin-swc';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

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
              jsx: true,
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
        manualChunks: id =>
          id.includes('node_modules') ? 'vendor' : path.parse(id).name,
      } : {},
      name,
      sourcemap: true,
      globals: defaultGlobals,
    },
    external: defaultExternals,
  })), {
    input: './lib/index.ts',
    output: [{ file: './dist/index.d.ts', format: 'es' }],
    plugins: [
      typescript({
        emitDeclarationOnly: true,
        declaration: true,
        declarationDir: './types',
        tsconfig: path.resolve('../../tsconfig.json'),
        outputToFilesystem: true,
        incremental: false,
        include: ['lib/**/*.ts'],
        exclude: [
          '**/*.test.ts',
          '**/tests/**/*',
        ],
      }),
      ...defaultPlugins,
      {
        writeBundle () {
          fs.unlinkSync('./dist/index.d.ts');
        },
      },
    ],
  }, {
    input: './dist/types/index.d.ts',
    output: [{ file: `dist/${name}.d.ts`, format: 'es' }],
    external: [
      ...defaultExternals,
      'query-string',
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: true,
        extensions: ['.js', '.ts', '.json', '.node'],
      }),
      dts({ respectExternal: true }),
      {
        writeBundle () {
          fs.rmSync('./dist/types', { recursive: true, force: true });
        },
      },
    ],
  }];
