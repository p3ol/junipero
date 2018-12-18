import { injectStyles } from './utils';

import mainStyles from './theme/index.styl';

export const inject = (styles, id) => {
  injectStyles(mainStyles, { id: 'junipero-main-styles' });
  injectStyles(styles, { id, after: '#junipero-main-styles' });
};
