const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    'undefined': './src/index.js',
    'examples': './examples/index.js',
  },
  target: 'web',
  module: {
    rules: [{
      test: /\.js/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        query: {
          presets: [
            ['@babel/preset-env', { 'modules': false }],
            '@babel/preset-react',
          ],
          plugins: [
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-object-rest-spread',
          ],
        },
      }],
    }, {
      test: /\.styl$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            singleton: true,
          },
        },
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: (loader) => ([autoprefixer]),
          },
        },
        'stylus-loader',
      ],
    }],
  },
  node: false,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },
};
