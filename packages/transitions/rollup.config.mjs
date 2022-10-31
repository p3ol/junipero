import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const input = './lib/index.js';
const output = './dist';
const name = 'junipero-transitions';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = ['react', 'react-transition-group'];
const defaultGlobals = {
  react: 'React',
  'react-transition-group': 'ReactTransitionGroup',
};

const defaultPlugins = [
  commonjs({ include: /node_modules/ }),
  babel({
    exclude: /node_modules/,
    babelHelpers: 'runtime',
  }),
  resolve(),
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
    ...(f === 'esm' ? {
      manualChunks: id =>
        id.includes('node_modules') ? 'vendor' : path.parse(id).name,
    } : {}),
  },
}));
