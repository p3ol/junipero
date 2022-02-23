module.exports = {
  presets: [
    ['@babel/preset-react', {
      runtime: 'automatic',
    }],
  ],
  overrides: [{
    exclude: [
      './packages/junipero-native/**/*.js',
      'node_modules/react-native',
      'node_modules/@react-native',
    ],
    presets: ['@babel/preset-env'],
    plugins: [
      ['@babel/transform-runtime', {
        regenerator: true,
      }],
    ],
  }, {
    test: [
      './packages/junipero-native/**/*.js',
      'node_modules/react-native',
      'node_modules/@react-native',
    ],
    presets: [
      'module:metro-react-native-babel-preset',
    ],
  }],
};
