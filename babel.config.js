module.exports = {
  presets: [
    ['@babel/preset-react', {
      runtime: 'classic',
    }],
  ],
  overrides: [{
    exclude: [
      './packages/junipero-native/**/*.js',
      'node_modules/react-native',
    ],
    presets: ['@babel/preset-env'],
  }, {
    test: [
      './packages/junipero-native/**/*.js',
      'node_modules/react-native',
    ],
    presets: [
      'module:metro-react-native-babel-preset',
    ],
  }, {
    test: '**/*.test.js',
    plugins: [
      ['@babel/transform-runtime', {
        regenerator: true,
      }],
    ],
  }],
};
