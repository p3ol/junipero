import type { PluginCreator } from 'tailwindcss/types/config';
import tailwind, { type Config } from 'tailwindcss';
import postcss from 'postcss';

export const generate = async (
  plugin: { handler: PluginCreator; config?: Partial<Config>; },
  content: string
) => (
  // @ts-expect-error - TODO fixme
  postcss([
    tailwind({
      content: [{ raw: content }],
      plugins: [plugin],
    }),
  ]).process('@tailwind utilities;', {
    from: undefined,
  }).then(result => result.css)
);
