export { default as colors } from './colors';
export { default as commons } from './commons';

export const applyStyles = (condition, styles) =>
  condition ? [].concat(styles) : [];
