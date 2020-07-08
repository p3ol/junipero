module.exports = {
  extends: ['@poool/eslint-config-react'],
  overrides: [{
    files: ['packages/**/*.test.js'],
    parser: 'babel-eslint',
    env: {
      jest: true,
    },
  }, {
    files: ['packages/junipero-native'],
    extends: ['@poool/eslint-config-react-native'],
  }],
  rules: {
    // regex cannot be concatenated
    'max-len': [1, { ignoreRegExpLiterals: true }],

    // no-empty is annoying with empty catches
    'no-empty': [2, { allowEmptyCatch: true }],

    // Common props are not checked anyway
    'react/prop-types': [2, { ignore: ['className', 'children'] }],

    // Directly assigning this.state is sometimes required in addition to
    // setState
    'react/no-direct-mutation-state': 0,

    // this.state.opened ? this.close() : this.open()
    // is a false positive
    'babel/no-unused-expressions': 0,
  },
};
