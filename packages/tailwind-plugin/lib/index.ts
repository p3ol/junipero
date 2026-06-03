import plugin from 'tailwindcss/plugin';
import { COLORS, fromPairs } from '@junipero/core';

// Tailwind's flattenColorPalette esm build does not work well with tsdown
const flattenColorPalette = (
  colors: Record<string, any>
): Record<string, string> =>
  Object.assign(
    {},
    ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
      typeof values == 'object'
        ? Object.entries(flattenColorPalette(values)).map(([number, hex]) => ({
          [color + (number === 'DEFAULT' ? '' : `-${number}`)]: hex,
        }))
        : [{ [`${color}`]: values }]
    )
  );

const junipero: ReturnType<typeof plugin> = plugin(({
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
    extend: {
      colors: COLORS,
    },
  },
});

export default junipero;
