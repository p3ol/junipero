module.exports = {
  stories: ['../packages/**/*.stories.js'],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions/register',
  ],
  core: {
    builder: 'webpack5',
  }
};
