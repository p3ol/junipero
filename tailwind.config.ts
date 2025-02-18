import junipero from './packages/tailwind-plugin/lib/index';

export default {
  content: [
    './packages/**/lib/**/*.stories.{jsx,tsx}',
  ],
  plugins: [
    junipero,
  ],
};
