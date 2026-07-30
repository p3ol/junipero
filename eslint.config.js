import { defineConfig, globalIgnores } from 'eslint/config';
import pooolint from '@poool/eslint-config-react';
import storybook from 'eslint-plugin-storybook';

export default defineConfig(
  globalIgnores([
    'dist',
    '**/dist',
    'coverage',
    '.yarn',
    'node_modules',
    'storybook-static',
  ]),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  pooolint.configs.recommended,
  storybook.configs['flat/recommended'],
);
