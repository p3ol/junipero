export const ensureNode = (selectorOrNode: string | Node):Node | string =>
  typeof selectorOrNode === 'string' && typeof document !== 'undefined'
    ? document.querySelector(selectorOrNode) || document.createElement('div')
    : selectorOrNode;
