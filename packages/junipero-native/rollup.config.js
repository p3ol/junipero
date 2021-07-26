import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const input = './lib/index.js';
const output = './dist';
const name = 'junipero-native';
const formats = ['cjs', 'esm'];

const defaultExternals = ['react', 'react-dom', 'prop-types', 'react-native'];
const defaultGlobals = {
  react: 'React',
  'prop-types': 'PropTypes',
  'react-dom': 'ReactDOM',
  'react-popper': 'ReactPopper',
  'react-native': 'ReactNative',
};

const defaultPlugins = [
  babel({
    exclude: /node_modules/,
    babelHelpers: 'bundled',
  }),
  resolve({
    rootDir: path.resolve('../../'),
  }),
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
      if (/packages\/junipero-native\/lib\/(\w+)\/(.+)(\.styles\.js|\.js)/.test(id)) {
        return path.parse(id).dir.split('/').pop();
      } else if (
        id.includes('node_modules') ||
        /rollupPluginBabelHelpers/.test(id) ||
        /packages\/junipero-(?!native)(\w+)/.test(id)
      ) {
        return 'vendor';
      } else {
        return path.parse(id).name;
      }
    },
  } : {}),
}));
