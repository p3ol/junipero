const plugin = require('tailwindcss/plugin');
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');
const { COLORS } = require('@junipero/core');

module.exports = plugin(({
  matchUtilities,
  addVariant,
  theme,
  matchVariant,
}) => {
  // Dropdown
  addVariant('dropdown-open', '.junipero.dropdown.opened &');
  addVariant('dropdown-menu-inner', '& > .menu-inner');

  // Tooltip
  addVariant('tooltip-inner', '& > .tooltip-inner');

  // Charts
  matchUtilities({
    serie: value => ({
      '--main-color': value,
    }),
  }, { values: flattenColorPalette(theme('colors')), type: 'color' });
  addVariant('curve', '.junipero.chart &.curve');
  addVariant('bar', '.junipero.chart &.bar');
  addVariant('dot', '.junipero.chart &.dot');
  matchVariant(
    'bar-nth',
    val => `.junipero.chart &.bar .serie:nth-child(${val})`,
    { values: [...Array(10).keys()] }
  );
}, {
  theme: {
    colors: COLORS,
  },
});
