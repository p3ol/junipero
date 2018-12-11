const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'examples': './examples/index.js',
  },
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: './dist',
    port: 65000,
    host: 'localhost',
    historyApiFallback: true,
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new HtmlWebpackPlugin({
      template: './examples/index.html',
      chunks: ['examples'],
      inject: true,
    }),
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@poool/junipero': path.resolve('./src'),
    },
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
    }, {
      test: /\.(gif|svg|jpg|png)$/,
      loader: 'file-loader',
    }],
  },
};
