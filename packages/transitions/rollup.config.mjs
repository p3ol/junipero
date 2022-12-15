import path from 'path';

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';

const input = './lib/index.js';
const output = './dist';
const name = 'junipero-transitions';
const formats = ['umd', 'cjs', 'esm'];

const defaultExternals = [
  'react',
  '@junipero/react',
];
const defaultGlobals = {
  react: 'React',
  '@junipero/react': 'JuniperoReact',
};

const defaultPlugins = [
  commonjs({ include: /node_modules/ }),
  babel({
    exclude: /node_modules/,
    babelHelpers: 'runtime',
  }),
  alias({
    entries: {
      '@junipero/react': path.resolve('../react/lib'),
      '@junipero/hooks': path.resolve('../hooks/lib'),
      '@junipero/core': path.resolve('../core/lib'),
    },
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
