const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  stories: ['../packages/**/*.stories.js'],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions/register',
  ],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: config => {
    config.resolve.modules = ['node_modules', path.resolve('./node_modules')];
    config.resolve.alias = {
      'react-native': 'react-native-web',
    };

    config.module.rules.push({
      test: /react-native-web\/(.+).js$/,
      use: [
        'babel-loader',
      ],
    });
  
    config.module.rules.push({
      test: /\.styl$/,
      use: [
        'style-loader',
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
    });

    return config;
  },
};
