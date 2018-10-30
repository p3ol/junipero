const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

const common = require('./webpack.common');

module.exports = merge(common, {
  entry: {
    'junipero.min': './src/index.js',
  },
  mode: 'production',
  optimization: {
    minimize: false,
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin({
      include: /\.min\.js$/,
      parallel: 4,
      uglifyOptions: {
        output: {
          comments: false,
        },
      },
    }),
    //new BundleAnalyzerPlugin(),
  ],
  externals: {
    react: 'React',
    'prop-types': 'PropTypes',
  },
  parallelism: 4,
  devtool: 'source-map',
});
