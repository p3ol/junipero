export const classNames = (...args) => {
  const classes = [];

  args.map(arg => {
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

export const mockState = (state, action) => ({ ...state, ...action });

export const isUndefined = v => typeof v === 'undefined';

export const isNull = v => v === null;

export const exists = v => !isNull(v) && !isUndefined(v);

export const get = (obj = {}, path = '', defaultValue = null) => path
  .split('.')
  .reduce((a, c) => exists(a?.[c]) ? a[c] : defaultValue, obj);

export const set = (obj = {}, path = '', value, customizer = val => val) => {
  path = path.split('.');
  const subObj = path
    .slice(0, -1)
    .reduce((a, c, i) => {
      if (a[c] && typeof a[c] === 'object') {
        return a[c];
      }
      a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {};

      return a[c];
    }, obj);

  subObj[path.slice(-1)[0]] = customizer(value, subObj[path.slice(-1)[0]]);
  return obj;
};

export const omitBy = (obj = {}, cb) => Object
  .entries(obj)
  .filter(([k, v]) => !cb(v, k))
  .reduce((res, [k, v]) => ({ ...res, [k]: v }), {});

export const omit = (obj = {}, keys = []) =>
  omitBy(obj || {}, (value, key) => keys.includes(key));

export const pick = (obj = {}, keys = []) =>
  keys.reduce((res, k) => {
    if (!isUndefined(obj[k])) {
      res[k] = obj[k];
    }
    return res;
  }, {});
