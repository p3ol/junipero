import path from 'node:path';

import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../packages/**/lib/**/*.stories.{js,tsx}',
  ],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-themes',
    {
      name: '@storybook/addon-styling-webpack',
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
    '@storybook/addon-webpack5-compiler-swc',
  ],
  framework: '@storybook/react-webpack5',
  webpackFinal: (config) => {
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
  swc: config => ({
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
        jsx: true,
      },
    },
  }),
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
