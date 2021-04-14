module.exports = {
  env: {
    tests: {
      presets: [
        '@babel/env',
        ['@babel/react', {
          runtime: 'automatic',
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
