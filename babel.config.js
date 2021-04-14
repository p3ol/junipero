module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', {
      runtime: 'classic',
    }],
  ],
  env: {
    tests: {
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', {
          runtime: 'classic',
        }],
        'module:metro-react-native-babel-preset',
      ],
      plugins: [
        ['@babel/transform-runtime', {
          regenerator: true,
        }],
      ],
    },
  },
};
