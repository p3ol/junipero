const merge = require('webpack-merge');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
  },
  plugins: [
    //new BundleAnalyzerPlugin(),
  ],
  externals: {
    react: 'React',
    'prop-types': 'PropTypes',
  },
  parallelism: 4,
  devtool: 'source-map',
});
