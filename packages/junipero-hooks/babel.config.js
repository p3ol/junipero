module.exports = {
  presets: [
    ['@babel/preset-env', {
      corejs: 3,
      useBuiltIns: 'usage',
      browserslistEnv: process.env.BROWSERSLIST_ENV,
    }],
    ['@babel/preset-react', {
      runtime: 'classic',
    }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
    }],
  ],
};
