import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import path from 'path';

const isForIE = process.env.BROWSERSLIST_ENV === 'ie';
const input = './lib/index.js';
const output = `./dist${isForIE ? '/ie' : ''}`;
const name = 'junipero-hooks';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = ['react'];
const defaultGlobals = {
  react: 'React',
};

const defaultPlugins = [
  babel({
    exclude: /node_modules/,
    babelHelpers: 'runtime',
  }),
  resolve(),
  commonjs(),
  terser(),
];

export default formats.map(f => ({
  input,
  plugins: [
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
  },
  ...(f === 'esm' ? {
    manualChunks: id =>
      id.includes('node_modules') ? 'vendor' : path.parse(id).name,
  } : {}),
}));
