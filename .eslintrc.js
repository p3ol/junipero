module.exports = {
  extends: ['@poool/eslint-config-react'],
  overrides: [{
    files: ['tests/**/*.js'],
    parser: 'babel-eslint',
    env: {
      jest: true,
    },
  }],
};
