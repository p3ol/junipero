export const injectStyles = (styles, options) => {
  if (!styles || typeof document === 'undefined') {
    return;
  }

  let tag = document.getElementById(options.id);
  const head = document.head || document.querySelector('head');

  if (!tag) {
    tag = document.createElement('style');
    tag.type = 'text/css';
    tag.id = options.id;

    const target = head?.querySelector(options.after) || head?.lastChild;
    head.insertBefore(tag, target?.nextSibling);

    if (tag.styleSheet) {
      tag.styleSheet.cssText = styles;
    } else {
      tag.innerHTML = styles;
    }
  }
};
