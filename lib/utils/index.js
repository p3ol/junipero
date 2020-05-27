export const classNames = (...args) => {
  const classes = [];

  args.map((arg) => {
    if (!arg) {
      return;
    }

    if (typeof arg === 'string' || typeof arg === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg) && arg.length) {
      const inner = classNames(...arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (typeof arg === 'object') {
      Object.entries(arg).map(([k, v]) => {
        if (v) {
          classes.push(k);
        }
      });
    }
  });

  return classes.join(' ');
};
