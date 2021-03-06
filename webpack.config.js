const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: './examples/index.js',
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    quiet: true,
    contentBase: './dist',
    port: 65000,
    host: 'localhost',
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/index.html',
      inject: true,
    }),
    new FriendlyErrorsWebpackPlugin({ clearConsole: true }),
  ],
  resolve: {
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
            postcssOptions: {
              sourceMap: true,
              plugins: [autoprefixer],
            },
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
