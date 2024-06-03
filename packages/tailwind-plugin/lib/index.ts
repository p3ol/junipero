import plugin from 'tailwindcss/plugin';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import { COLORS, fromPairs } from '@junipero/core';

export default plugin(({
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
    {
      values: fromPairs(Array.from({ length: 10 })
        .map((_, i) => [i + 1, '' + i + 1])),
    }
  );
}, {
  theme: {
    colors: COLORS,
  },
});
