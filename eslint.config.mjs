import tseslint from 'typescript-eslint';
import pooolint from '@poool/eslint-config-react';
import storybook from 'eslint-plugin-storybook';

export default tseslint.config(
  { ignores: [
    'dist',
    '**/dist',
    'coverage',
    '.yarn',
    'node_modules',
    'storybook-static',
  ] },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...pooolint.configs.recommended,
  storybook.configs['flat/recommended'],
);
