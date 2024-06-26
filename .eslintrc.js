module.exports = {
  extends: ['@poool/eslint-config-react'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: [
        'packages/**/*.test.js',
        'packages/**/*.test.tsx',
        'packages/**/*.test.ts',
      ],
      env: {
        jest: true,
      },
    },
    {
      files: ['packages/**/*.{ts,tsx}'],
      globals: {
        JSX: 'readonly',
        React: 'readonly',
      },
      rules: {
        // function params are considered as unused vars
        'no-undef': 0,
        'no-unused-vars': 0,
      },
    },
  ],
  rules: {
    // regex cannot be concatenated
    'max-len': [1, { ignoreRegExpLiterals: true }],

    // no-empty is annoying with empty catches
    'no-empty': [2, { allowEmptyCatch: true }],

    // Common props are not checked anyway
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
  },
};
