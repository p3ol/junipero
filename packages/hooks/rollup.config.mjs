import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';

const input = './lib/index.ts';
const output = './dist';
const name = 'junipero-hooks';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = ['react'];
const defaultGlobals = {
  react: 'React',
};

const defaultPlugins = [
  commonjs(),
  babel({
    exclude: /node_modules/,
    babelHelpers: 'runtime',
  }),
  resolve(),
  terser(),
];

export default [
  ...formats.map(f => ({
    input,
    plugins: [
      typescript({
        rootDir: path.resolve('./lib'),
        emitDeclarationOnly: true,
        declaration: true,
        project: path.resolve('./tsconfig.build.json'),
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
      name,
      sourcemap: true,
      globals: defaultGlobals,
      ...(f === 'esm' ? {
        manualChunks: id =>
          id.includes('node_modules') ? 'vendor' : path.parse(id).name,
      } : {}),
    },
  })), {
    input: './dist/dts/index.d.ts',
    output: [{ file: `dist/${name}.d.ts`, format: 'es' }],
    plugins: [dts()],
  }];
