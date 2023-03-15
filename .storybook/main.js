const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  stories: [
    '../packages/*/lib/*/*.stories.js',
    '../packages/*/lib/*.stories.js',
  ],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions/register',
    'storybook-dark-mode',
  ],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: config => {
    config.resolve.modules = ['node_modules', path.resolve('./node_modules')];
    config.resolve.alias = {
      'react-native': 'react-native-web',
      '@junipero/core': path.resolve('./packages/core/lib'),
      '@junipero/react': path.resolve('./packages/react/lib'),
      '@junipero/hooks': path.resolve('./packages/hooks/lib'),
      '@junipero/transitions': path.resolve('./packages/transitions/lib'),
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

    config.module.rules.push({
      test: /\.sass$/,
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
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              includePaths: [
                path.resolve('./packages/theme/lib/utils'),
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};
