import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import { terser } from 'rollup-plugin-terser';

const isForIE = process.env.BABEL_ENV === 'ie';
const input = './src/index.js';
const output = `./dist${isForIE ? '/ie' : ''}/junipero`;
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = ['react', 'react-dom', 'prop-types', 'react-popper'];
const defaultGlobals = {
  react: 'React',
  'prop-types': 'PropTypes',
  'react-dom': 'ReactDOM',
  'react-popper': 'ReactPopper',
};

const defaultPlugins = [
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'runtime',
  }),
  postcss({
    extensions: ['.styl'],
    minimize: true,
    inject: false,
    plugins: [
      autoprefixer,
    ],
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
    file: `${output}.${f}.js`,
    format: f,
    name: 'junipero',
    sourcemap: true,
    globals: defaultGlobals,
  },
}));
