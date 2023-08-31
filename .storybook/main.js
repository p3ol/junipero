module.exports = {
  stories: [
    '../packages/react/lib/**/*.stories.{js,tsx}',
    '../packages/theme/lib/**/*.stories.{js, tsx}',
    '../packages/**/lib/**/*.stories.{js,tsx}'
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
