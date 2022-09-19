import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import external from 'rollup-plugin-peer-deps-external';

const input = './lib/index.js';
const output = './dist';
const name = 'junipero-react-native';
const formats = ['cjs', 'esm'];

const defaultPlugins = [
  external(),
  commonjs({ include: /node_modules/ }),
  babel({
    exclude: /node_modules/,
    babelHelpers: 'bundled',
  }),
  resolve({
    rootDir: path.resolve('../../'),
  }),
  terser(),
  alias({
    entries: {
      '@junipero/core': path.resolve('../core/lib'),
      '@junipero/hooks': path.resolve('../hooks/lib'),
    },
  }),
];

export default formats.map(f => ({
  input,
  plugins: [
    ...defaultPlugins,
  ],
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
  },
  ...(f === 'esm' ? {
    manualChunks: id => {
      if (/packages\/react-native\/lib\/(\w+)\/(.+)(\.styles\.js|\.js)/.test(id)) {
        return path.parse(id).dir.split('/').pop();
      } else if (
        id.includes('node_modules') ||
        /rollupPluginBabelHelpers/.test(id) ||
        /packages\/(core|hooks)(\w+)/.test(id)
      ) {
        return 'vendor';
      } else {
        return path.parse(id).name;
      }
    },
  } : {}),
}));
