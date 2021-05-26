import path from 'path';
import fs from 'fs';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import { terser } from 'rollup-plugin-terser';

const isForIE = process.env.BROWSERSLIST_ENV === 'ie';
const input = './lib/index.js';
const output = `./dist${isForIE ? '/ie' : ''}`;
const name = 'junipero';
const formats = ['umd', 'cjs', 'esm'];

const components = fs.readdirSync('./lib', { withFileTypes: true })
  .filter(f =>
    f.isDirectory() &&
    fs.existsSync(path.resolve('./lib', f.name, 'index.styl'))
  )
  .map(f => f.name);

const defaultExternals = ['react', 'react-dom', 'prop-types', 'react-popper'];
const defaultGlobals = {
  react: 'React',
  'prop-types': 'PropTypes',
  'react-dom': 'ReactDOM',
  'react-popper': 'ReactPopper',
};

const defaultPlugins = [
  babel({
    exclude: /node_modules/,
    babelHelpers: 'runtime',
  }),
  resolve({
    rootDir: path.resolve('../../'),
  }),
  commonjs(),
  terser(),
];

const onFileConflictWarn = (warning, warn) => {
  if (warning.code === 'FILE_NAME_CONFLICT') {
    return;
  }

  warn(warning);
};

export default [
  ...formats.map(f => ({
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
      name: 'junipero',
      sourcemap: true,
      globals: defaultGlobals,
    },
    ...(f === 'esm' ? {
      manualChunks: id => {
        if (/packages\/junipero\/lib\/(\w+)\/index.js/.test(id)) {
          return path.parse(id).dir.split('/').pop();
        } else if (
          id.includes('node_modules') ||
          /packages\/junipero-(\w+)/.test(id)
        ) {
          return 'vendor';
        } else {
          return path.parse(id).name;
        }
      },
    } : {}),
  })),
  {
    input: './lib/index.styl',
    plugins: [
      postcss({
        extensions: ['.styl'],
        minimize: true,
        inject: false,
        extract: true,
        sourceMap: true,
        plugins: [
          autoprefixer({ env: process.env.BROWSERSLIST_ENV }),
        ],
      }),
    ],
    output: {
      file: `${output}/${name}.min.css`,
    },
    onwarn: onFileConflictWarn,
  },
  {
    input: './lib/reset.styl',
    plugins: [
      postcss({
        extensions: ['.styl'],
        minimize: true,
        inject: false,
        extract: true,
        sourceMap: true,
        plugins: [
          autoprefixer({ env: process.env.BROWSERSLIST_ENV }),
        ],
      }),
    ],
    output: {
      file: `${output}/css/index.min.css`,
    },
    onwarn: onFileConflictWarn,
  },
  ...components.map(c => ({
    input: `./lib/${c}/index.styl`,
    plugins: [
      postcss({
        extensions: ['.styl'],
        minimize: true,
        inject: false,
        extract: true,
        sourceMap: true,
        plugins: [
          autoprefixer({ env: process.env.BROWSERSLIST_ENV }),
        ],
      }),
    ],
    output: {
      file: `${output}/css/${c}.min.css`,
    },
    onwarn: onFileConflictWarn,
  })),
];
