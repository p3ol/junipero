export const ensureNode = (
  selectorOrNode: string | React.JSX.Element | DocumentFragment | HTMLElement
): Element | DocumentFragment =>
  typeof selectorOrNode === 'string' && typeof document !== 'undefined'
    ? document.querySelector(selectorOrNode) || document.createElement('div')
    : selectorOrNode as Element | DocumentFragment;
