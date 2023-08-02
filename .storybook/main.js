module.exports = {
  stories: [
    '../packages/react/lib/**/*.stories.js',
    '../packages/theme/lib/**/*.stories.js',
    '../packages/**/lib/**/*.stories.js'
  ],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: {
          implementation: require('postcss'),
        },
        sass: {
          implementation: require('sass'),
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
};
