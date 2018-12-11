import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';

const defaultConfig = () => ({
  input: 'src/index.js',
  output: {
    name: 'junipero',
    sourcemap: true,
  },
  plugins: [
    eslint({
      exclude: [
        'src/theme/**',
      ],
    }),
    babel({
      exclude: 'node_modules/**',
      externalHelpers: true,
    }),
    postcss({
      extensions: ['.styl'],
      minimize: true,
      inject: false,
      plugins: [
        autoprefixer,
      ],
    }),
  ],
  external: [
    'react',
    'react-dom',
    'prop-types',
    'react-popper',
  ],
});

const defaultUMDConfig = (minified = false, config = defaultConfig()) => ({
  ...config,
  output: {
    ...config.output,
    format: 'umd',
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
      'react-dom': 'ReactDOM',
      'react-popper': 'ReactPopper',
    },
  },
  plugins: [
    ...config.plugins,
    resolve(),
    commonjs(),
    minified ? terser() : null,
  ],
});

/*
  COMMONJS / MODULE CONFIG
*/
const libConfig = (config = defaultConfig()) => ({
  ...config,
  output: [
    { file: 'dist/junipero.cjs.js', format: 'cjs' },
  ],
});

/*
  UMD CONFIG
*/
const umdConfig = (config = defaultUMDConfig()) => ({
  ...config,
  output: {
    ...config.output,
    file: 'dist/junipero.js',
  },
});

const umdMinConfig = (config = defaultUMDConfig(true)) => ({
  ...config,
  output: {
    ...config.output,
    file: 'dist/junipero.min.js',
  },
});

export default [
  libConfig(),
  umdConfig(),
  umdMinConfig(),
];
