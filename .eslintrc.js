module.exports = {
  extends: ['@poool/eslint-config-react'],

  overrides: [

    {
      files: ['packages/**/*.test.js', 'packages/**/*.test.tsx'],
      env: {
        jest: true,
      },
    },
    {
      files: ['packages/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      globals: {
        JSX: 'readonly',
        React: 'readonly',
      },
      rules: {
        // function params are considered as unused vars
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
    'react/prop-types': [2, { ignore: ['className', 'children'] }],
    'react/react-in-jsx-scope': 0,
  },
};
