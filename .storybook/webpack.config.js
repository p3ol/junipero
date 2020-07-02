const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.styl$/,
    sideEffects: true,
    // resolve: {
    //   alias: {
    //     '@poool/junipero-utils':
    //       path.resolve('../packages/junipero-utils/lib/index.js'),
    //   }
    // },
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: loader => ([autoprefixer]),
        },
      },
      'stylus-loader',
    ],
  });

  return config;
};
