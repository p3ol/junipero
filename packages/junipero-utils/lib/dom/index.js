export const ensureNode = selectorOrNode =>
  typeof selectorOrNode === 'string' && typeof document !== 'undefined'
    ? document.querySelector(selectorOrNode) || document.createElement('div')
    : selectorOrNode;
