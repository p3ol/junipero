const merge = require('webpack-merge');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new UglifyJSPlugin(),
  ],
  parallelism: 4,
});
