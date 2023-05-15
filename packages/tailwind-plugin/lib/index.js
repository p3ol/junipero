const plugin = require('tailwindcss/plugin');
const { COLORS } = require('@junipero/core');

module.exports = plugin(() => {}, {
  theme: {
    colors: COLORS,
  },
});
