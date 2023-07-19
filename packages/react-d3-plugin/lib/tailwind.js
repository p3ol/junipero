const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addVariant }) => {
  addVariant('chart-grid', '& > .junipero.grid');
});
