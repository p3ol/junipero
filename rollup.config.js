import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import { terser } from 'rollup-plugin-terser';
import path from 'path';

const isForIE = process.env.BABEL_ENV === 'ie';
const input = './src/index.js';
const output = `./dist${isForIE ? '/ie' : ''}`;
const name = 'junipero';
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
    manualChunks: id => {
      return id.includes('node_modules')
        ? 'vendor'
        : id.includes('src/theme/index.styl')
          ? 'style'
          : path.parse(id).name;
    },
  } : {}),
}));
