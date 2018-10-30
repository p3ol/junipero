import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import del from 'rollup-plugin-delete';

import pkg from './package.json';

const defaultConfig = {
  input: 'src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    postcss({
      extensions: ['.styl'],
      minimize: true,
      plugins: [
        autoprefixer,
      ],
    }),
  ],
  external: [
    'react',
    'prop-types',
  ],
};

export default [
  {
    ...defaultConfig,
    output: {
      name: 'junipero',
      file: pkg.browser,
      format: 'umd',
      globals: {
        react: 'React',
        'prop-types': 'PropTypes',
      },
    },
    plugins: [
      del({ targets: 'dist/*' }),
      ...defaultConfig.plugins,
      resolve(),
      commonjs(),
    ],
  }, {
    ...defaultConfig,
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      ...defaultConfig.plugins,
    ],
  },
];
