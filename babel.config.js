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
    plugins: [
      '@babel/transform-runtime',
    ],
  }, {
    test: [
      './packages/junipero-native/**/*.js',
      'node_modules/react-native',
    ],
    presets: [
      'module:metro-react-native-babel-preset',
    ],
  }],
};
