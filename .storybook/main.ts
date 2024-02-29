import type { StorybookConfig } from "@storybook/react-webpack5";
const path = require('path')
const config: StorybookConfig = {
  stories: [
    '../packages/**/lib/**/*.stories.{js,tsx}'
  ],

  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    {
      name: 'storybook-addon-swc',
      options: {
        swcLoaderOptions: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
          },
        },
      },
    },
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: {
          implementation: require('postcss'),
        },
        sass: {
          implementation: require('sass'),
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
    
  },
  webpackFinal: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve?.alias,
      '@junipero/react': path.resolve(__dirname, '../packages/react/lib/index.ts'),
      '@junipero/core': path.resolve(__dirname, '../packages/core/lib/index.ts'),
      '@junipero/transitions': path.resolve(__dirname, '../packages/transitions/lib/index.tsx'),
      '@junipero/hooks': path.resolve(__dirname, '../packages/hooks/lib/index.ts'),
    };
    return config;
  },
};
export default config