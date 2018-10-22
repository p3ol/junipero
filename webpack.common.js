const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    'junipero': './src/index.js',
  },
  target: 'web',
  optimization: {
    minimize: false,
  },
  module: {
    rules: [{
      test: /\.js/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
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
    }, {
      test: /\.svg$/,
      loader: 'url-loader',
    }],
  },
  node: false,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'junipero',
    libraryTarget: 'umd',
    sourceMapFilename: '[name].js.map',
  },
};
