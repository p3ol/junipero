module.exports = {
  presets: [
    ['@babel/preset-env', {
      corejs: 3,
      useBuiltIns: 'usage',
      targets: {
        browsers: [
          'last 2 versions',
          'not ie >= 0',
          'not ie_mob >= 0',
          'not dead',
        ],
      },
    }],
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
    }],
    ['@babel/plugin-proposal-class-properties', {
      loose: true,
    }],
  ],
  env: {
    ie: {
      presets: [
        ['@babel/preset-env', {
          corejs: 3,
          useBuiltIns: 'usage',
          targets: {
            browsers: [
              'last 2 versions',
              'ie >= 11',
              'not dead',
            ],
          },
        }],
      ],
    },
  },
};
