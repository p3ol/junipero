const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.styl$/,
    sideEffects: true,
    resolve: {
      modules: ['node_modules', path.resolve('./node_modules')]
    },
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
