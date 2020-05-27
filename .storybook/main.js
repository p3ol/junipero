const autoprefixer = require('autoprefixer');

module.exports = {
  stories: ['../lib/**/*.stories.js'],
  webpackFinal: config => {
    config.module.rules.push({
      test: /\.styl$/,
      use: [
        'style-loader',
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
  },
};
