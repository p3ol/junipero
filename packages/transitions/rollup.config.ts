import path from 'node:path';

import alias from '@rollup/plugin-alias';
import swc from '@rollup/plugin-swc';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

const formats = ['umd', 'cjs', 'esm'];
const output = './dist';
const name = 'junipero-transitions';

const defaultExternals = [
  'react', 'react-dom', '@junipero/react',
];

const defaultGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@junipero/react': 'JuniperoReact',
};

const defaultPlugins = [
  commonjs({ include: /node_modules/ }),
  resolve({
    extensions: ['.js', '.ts', '.tsx', '.json', '.node'],
  }),
  terser(),
];

export default [
  ...formats.map(f => ({
    input: './lib/index.tsx',
    plugins: [
      alias({
        entries: {
          '@junipero/react': path.resolve('../react/lib/index.ts'),
        },
      }),
      swc({
        swc: {
          jsc: {
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
          },
        },
      }),
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
        manualChunks: (id: string) =>
          id.includes('node_modules') ? 'vendor' : path.parse(id).name,
      } : {}),
    },
  })),
];
