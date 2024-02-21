import path from 'path';
import fs from 'node:fs';

import alias from '@rollup/plugin-alias';
import swc from '@rollup/plugin-swc';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';

const formats = ['umd', 'cjs', 'esm'];
const output = './dist';
const name = 'junipero-transition';
const defaultExternals = [
  'react', 'react-dom',
];
const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

const defaultPlugins = [
  resolve({
    browser: true,
    preferBuiltins: true,
    extensions: ['.js', '.ts', '.tsx', '.json', '.node'],
  }),
  commonjs({ include: /node_modules/ }),
  alias({
    entries: {
      '@junipero/react': path.resolve('../react/lib/index.ts'),
    },
  }),
  terser(),
];

export default [
  ...formats.map(f => ({
    input: './lib/index.tsx',
    plugins: [
      alias({
        entries: {
          '@junipero/react': path.resolve('../react/lib/index.ts'), // TODO rework aliases
        },
      }),
      swc({
        swc: {
          jsc: {
            parser: {
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
        manualChunks: id =>
          id.includes('node_modules') ? 'vendor' : path.parse(id).name,
      } : {}),
    },
  })),
  {
    input: './lib/index.tsx',
    output: [{ file: `./dist/${name}.d.ts`, format: 'es' }],
    external: [...defaultExternals, '@junipero/react'],
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
    input: './dist/types/transitions/lib/index.d.ts',
    output: [{ file: `dist/${name}.d.ts`, format: 'es' }],
    external: [
      ...defaultExternals,
      '@junipero/core',
      '@junipero/hooks',
      '@junipero/react',
    ],
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
