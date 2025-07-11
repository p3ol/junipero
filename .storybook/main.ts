import { createRequire } from "node:module";
import path, { dirname, join } from 'node:path';

import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Options } from '@swc/core';

const require = createRequire(import.meta.url);

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: [
    '../packages/**/lib/**/*.stories.{js,tsx}',
  ],
  addons: [
    getAbsolutePath("@storybook/addon-themes"),
    {
    name: getAbsolutePath("@storybook/addon-styling-webpack"),
      options: {
        rules: [
          {
            test: /\.sass$/,
            use: [
              'style-loader',
              'css-loader',
              'postcss-loader',
              'sass-loader',
            ],
          },
        ],
      },
    },
    getAbsolutePath("@storybook/addon-webpack5-compiler-swc"),
  ],
  framework: getAbsolutePath("@storybook/react-webpack5"),
  webpackFinal: config => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve?.alias,
      '@junipero/react': path
        .resolve(__dirname, '../packages/react/lib/index.ts'),
      '@junipero/core': path
        .resolve(__dirname, '../packages/core/lib/index.ts'),
      '@junipero/transitions': path
        .resolve(__dirname, '../packages/transitions/lib/index.tsx'),
      '@junipero/hooks': path
        .resolve(__dirname, '../packages/hooks/lib/index.ts'),
    };

    return config;
  },
  swc: (config: Options): Options => ({
    ...config,
    jsc: {
      ...config.jsc,
      transform: {
        ...config.jsc?.transform,
        react: {
          ...config.jsc?.transform?.react,
          runtime: 'automatic',
        },
      },
      parser: {
        ...config.jsc?.parser,
        syntax: 'typescript',
        tsx: true,
      },
    },
  }),
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
