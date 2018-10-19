const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
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
});
