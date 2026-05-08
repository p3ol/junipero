// @vitest-environment node

import path from 'node:path';

import tailwindcss from '@tailwindcss/postcss';
import postcss from 'postcss';

const currentPath = path.resolve('./packages/tailwind-plugin');

describe('@junipero/tailwind-plugin', () => {
  it('should generate the correct CSS', async () => {
    const css = await postcss([
      tailwindcss({
        base: path.resolve(currentPath, './tests'),
      }),
    ]).process(`
      @layer theme, utilities;

      @import "tailwindcss/theme.css" layer(theme);
      @import "tailwindcss/utilities.css" layer(utilities);

      @plugin './lib/index.ts';
    `, {
      from: path.resolve(currentPath, './lib'),
    }).then(result => result.css);

    expect(css).toMatchSnapshot();
  });
});
