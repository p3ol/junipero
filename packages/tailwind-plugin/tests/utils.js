import postcss from 'postcss';
import tailwind from 'tailwindcss';

export const generate = async (plugin, content) => (
  postcss([
    tailwind({
      content: [{ raw: content }],
      plugins: [plugin],
    }),
  ]).process('@tailwind utilities;', {
    from: undefined,
  }).then(result => result.css)
);
