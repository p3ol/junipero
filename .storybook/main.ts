import { createRequire } from 'node:module';
import path from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const require = createRequire(import.meta.url);

function getAbsolutePath (value: string): any {
  return path.dirname(require.resolve(path.join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
    '../packages/**/lib/**/*.stories.{js,tsx}',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-themes'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  viteFinal: async config => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@junipero/react': path.resolve(__dirname, '../packages/react'),
          '@junipero/core': path.resolve(__dirname, '../packages/core'),
          '@junipero/transitions': path
            .resolve(__dirname, '../packages/transitions'),
          '@junipero/hooks': path.resolve(__dirname, '../packages/hooks'),
        },
      },
    });
  },
};

export default config;
