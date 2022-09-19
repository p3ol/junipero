import path from 'path';
import fs from 'fs';

import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

const output = './dist';
const name = 'junipero';

const components = fs.readdirSync('./lib', { withFileTypes: true })
  .filter(f =>
    f.isDirectory() &&
    fs.existsSync(path.resolve('./lib', f.name + '.sass'))
  )
  .map(f => f.name);

const onFileConflictWarn = (warning, warn) => {
  if (warning.code === 'FILE_NAME_CONFLICT') {
    return;
  }

  warn(warning);
};

const defaultPlugins = [
  postcss({
    extensions: ['.sass'],
    minimize: true,
    inject: false,
    extract: true,
    sourceMap: true,
    use: [
      ['sass', {
        includePaths: [
          path.resolve(__dirname, './lib/utils'),
        ],
      }],
    ],
    plugins: [
      autoprefixer(),
    ],
  }),
];

export default [
  {
    input: './lib/index.sass',
    plugins: [
      ...defaultPlugins,
    ],
    output: {
      file: `${output}/${name}.min.css`,
    },
    onwarn: onFileConflictWarn,
  },
  {
    input: './lib/reset.sass',
    plugins: [
      ...defaultPlugins,
    ],
    output: {
      file: `${output}/css/reset.min.css`,
    },
    onwarn: onFileConflictWarn,
  },
  ...components.map(c => ({
    input: `./lib/${c}.sass`,
    plugins: [
      postcss({
        extensions: ['.sass'],
        minimize: true,
        inject: false,
        extract: true,
        sourceMap: true,
        plugins: [
          autoprefixer(),
        ],
      }),
    ],
    output: {
      file: `${output}/css/${c}.min.css`,
    },
    onwarn: onFileConflictWarn,
  })),
];
