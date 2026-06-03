import type { Config } from 'postcss-load-config';

const config: Config = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;
