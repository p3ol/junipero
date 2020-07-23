export { default as colors } from './colors';
export { default as commons } from './commons';

export const applyStyles = (condition, styles) =>
  condition ? [].concat(styles) : [];

export const getIcon = name => {
  switch (name) {
    case 'check':
      return '\u{e900}';
    case 'mood':
      return '\u{e905}';
    case 'mood-bad':
      return '\u{e906}';
    case 'back':
      return '\u{e901}';
    case 'verified-outline':
      return '\u{e902}';
    case 'info':
      return '\u{e903}';
    case 'info-outline':
      return '\u{e904}';
    case 'visibility-off':
      return '\u{e907}';
    case 'visibility':
      return '\u{e908}';
    default:
      return '';
  }
};
