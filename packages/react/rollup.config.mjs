import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';

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
  babel({
    exclude: /node_modules/,
    babelHelpers: 'runtime',
  }),
  alias({
    entries: {
      '@junipero/core': path.resolve('../core/dist/esm'), // TODO rework aliases
      '@junipero/hooks': path.resolve('../hooks/dist/esm'),
    },
  }),
  resolve({
    rootDir: path.resolve('../../'),
  }),
  terser(),
];

export default [
  ...formats.map(f => ({
    input,
    plugins: [
      typescript({
        emitDeclarationOnly: true,
        declaration: true,
        project: path.resolve('./tsconfig.build.json'),
        declarationDir: path.resolve('./@types'),
        ...f === 'esm' ? { declarationDir: path.resolve('./dist/esm') } : {},
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
      name: 'JuniperoReact',
      sourcemap: true,
      globals: defaultGlobals,
      ...(f === 'esm' ? {
        manualChunks: id => {
          if (/packages\/react\/lib\/(\w+)\/index.js/.test(id)) {
            return path.parse(id).dir.split('/').pop();
          } else if (/packages\/core/.test(id)) {
            return 'core';
          } else if (/packages\/hooks/.test(id)) {
            return 'hooks';
          } else if (id.includes('node_modules')) {
            return 'vendor';
          } else {
            return path.parse(id).name;
          }
        },
      } : {}),
    },
  })), {
    input: './dist/@types/index.d.ts',
    output: [{ file: `dist/${name}.d.ts`, format: 'es' }],
    plugins: [dts()],
  },
];
