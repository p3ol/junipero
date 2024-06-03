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
const name = 'junipero-tailwind-plugin';
const formats = ['cjs', 'esm'];

const defaultExternals = [
  'tailwindcss', '@junipero/core',
];
const defaultGlobals = {
  tailwindcss: 'tailwindcss',
  '@junipero/core': 'JuniperoCore',
};

const defaultPlugins = [
  alias({
    entries: {
      '@junipero/core': path.resolve('../core'),
    },
  }),
  resolve({
    rootDir: path.resolve('../../'),
    extensions: ['.js', '.ts', '.tsx', '.json', '.node'],
  }),
  commonjs({ include: /node_modules/ }),
  terser(),
];

export default [
  ...formats.map(f => ({
    input,
    plugins: [
      swc({
        swc: {
          env: {
            targets: 'node 16',
          },
        },
      }),
      ...defaultPlugins,
    ],
    external: [
      ...defaultExternals,
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
      },
      ...(f === 'esm' ? {
        manualChunks: id => {
          if (/packages\/tailwind-plugin\/lib\/(\w+)\/index.ts/.test(id)) {
            return path.parse(id).dir.split('/').pop();
          } else if (/packages\/core/.test(id)) {
            return 'core';
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
    output: [{
      file: `./dist/${name}.d.ts`,
      format: 'esm',
      inlineDynamicImports: true,
      globals: {
        ...defaultGlobals,
      },
    }],
    external: [
      ...defaultExternals,
    ],
    plugins: [
      typescript({
        emitDeclarationOnly: true,
        declaration: true,
        declarationDir: './types',
        tsconfig: path.resolve('./tsconfig.json'),
        outputToFilesystem: true,
        incremental: false,
        include: [
          'lib/**/*.ts',
          'lib/**/*.tsx',
          './global.d.ts',
        ],
        exclude: [
          '**/*.stories.tsx',
          '**/*.test.ts',
          '**/tests/**/*',
          'node_modules/**/*',
          '@junipero/core',
          'tailwindcss',
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
    input: './dist/types/tailwind-plugin/lib/index.d.ts',
    output: [{ file: `dist/${name}.d.ts`, format: 'es' }],
    external: defaultExternals,
    plugins: [
      resolve({
        browser: false,
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
  },
];
