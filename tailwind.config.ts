import junipero from './packages/tailwind-plugin/lib/index.ts';

export default {
  content: [
    './packages/**/lib/**/*.stories.{jsx,tsx}',
  ],
  plugins: [
    junipero,
  ],
};
