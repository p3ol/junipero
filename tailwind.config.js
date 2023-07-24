const junipero = require('./packages/tailwind-plugin/lib/index.js');

module.exports = {
  content: [
    './packages/**/lib/**/*.stories.js',
  ],
  plugins: [
    junipero,
  ],
};
