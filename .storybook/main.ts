import path from 'node:path';

import type { StorybookConfig } from '@storybook/react-webpack5';
import postcss from 'postcss';
import sass from 'sass';

const config: StorybookConfig = {
  stories: [
    '../packages/**/lib/**/*.stories.{js,tsx}',
  ],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: {
          implementation: postcss,
        },
        sass: {
          implementation: sass,
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
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
  })
};

export default config;
