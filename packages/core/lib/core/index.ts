export const classNames = (...args: Array<any>): string => {
  const classes = [];

  args.map((arg: string) => {
    if (!arg) {
      return false;
    }

    if (typeof arg === 'string' || typeof arg === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg) && (arg as Array<any>).length) {
      const inner = classNames(...arg as Array<string>);

      if (inner) {
        classes.push(inner);
      }
    } else if (typeof arg === 'object') {
      Object.entries(arg).map(([k, v]) => {
        if (v) {
          classes.push(k);
        }

        return false;
      });
    }

    return false;
  });

  return classes.join(' ');
};

export const addClass = (elmt: HTMLElement, cls: string): void => {
  if (elmt.className.indexOf(cls) === -1) {
    elmt.className += (elmt.className.length > 0 ? ' ' : '') + cls;
  }
};

export const removeClass = (elmt: HTMLElement, cls: string): void => {
  if (elmt.classList) {
    elmt.classList.remove(cls);
  } else {
    elmt.className = elmt.className
      .replace(new RegExp(`(^|\\b)${cls}(\\b|$)`, 'gi'), '')
      .replace(/\s+/g, ' ')
      .trim();
  }
};

export const mockState = (state, action) => typeof action === 'function'
  ? action(state) : ({ ...state, ...action });

export const isUndefined = (v: any): boolean => typeof v === 'undefined';

export const isNull = (v: any): boolean => v === null;

export const isArray = (a: any): boolean => Array.isArray(a);

export const isObject = (o: any): boolean =>
  typeof o === 'object' && o?.constructor?.name === 'Object';

export const isDate = (d: any): boolean => d instanceof Date;

export const exists = (v: any): boolean => !isNull(v) && !isUndefined(v);

export const get = (
  obj: object = {},
  path: string = '',
  defaultValue = null
) => path
  .split('.')
  .reduce((a, c) => exists(a?.[c]) ? a[c] : undefined, obj) ?? defaultValue;

export const set = (
  obj: object = {},
  path: string = '',
  value: any,
  customizer = (val: any, subobj: any) => val
): object => {
  const pathArr = path.split('.');
  const subObj = pathArr
    .slice(0, -1)
    .reduce((a, c, i) => {
      if (a[c] && typeof a[c] === 'object') {
        return a[c];
      }

      a[c] = Math.abs(
        parseFloat(pathArr[i + 1])
      ) >> 0 === +pathArr[i + 1] ? [] : {};

      return a[c];
    }, obj);

  subObj[path.slice(-1)[0]] = customizer(value, subObj[path.slice(-1)[0]]);

  return obj;
};

export const omitBy = (
  obj: object = {},
  cb: (k: any, v: string) => any
) => Object
  .entries(obj)
  .filter(([k, v]) => !cb(v, k))
  .reduce((res, [k, v]) => Object.assign({}, res, { [k]: v }), {});

export const omit = (obj: Object = {}, keys: Array<string> = []): Object =>
  omitBy(obj || {}, (value, key) => keys.includes(key));

export const pick = (obj: Object = {}, keys: Array<string> = []): Object =>
  keys.reduce((res, k) => {
    if (!isUndefined(obj[k])) {
      res[k] = obj[k];
    }

    return res;
  }, {});

export const cloneDeep = (obj: Object | Date | Array<any>): any =>
  typeof obj !== 'object' || obj === null
    ? obj
    : isDate(obj)
      ? new Date((obj as Date).getTime())
      : isArray(obj)
        ? [...(obj as Array<any>).map(o => cloneDeep(o))]
        : Object.entries(obj).reduce((res, [k, v]) => {
          res[k] = cloneDeep(v);

          return res;
        }, {});

export const fromPairs = (pairs: Array<any> = []): Array<any> =>
  pairs.reduce((res, [k, v]) => {
    res[k] = v;

    return res;
  }, {});

export const mergeDeep = (
  target: Object | Array<any>,
  ...sources: Array<any>
): Object | Array<any> =>
  isArray(target)
    ? (target as Array<any>).concat(...sources)
    : isObject(target)
      ? sources.reduce((s, source) => (
        isObject(source)
          ? Object.entries(source).reduce((t, [k, v]) => {
            /* istanbul ignore else: no else needed */
            if (isArray(t[k]) || isObject(t[k])) {
              t[k] = mergeDeep(target[k], v);
            } else if (!t[k] || !isObject(t[k])) {
              t[k] = v;
            }

            return t;
          }, s)
          : s
      ), target)
      : target;

export const filterDeep = (
  arr: Array<any> = [],
  cb: (v?: any) => boolean = () => true
): Array<any> => {
  const res = [];

  for (const v of arr) {
    if (cb(v)) {
      res.push(v);
    } else if (isArray(v)) {
      const r = filterDeep(v, cb);
      res.push(r);
    } else if (isObject(v) && !isDate(v)) {
      res.push(Object.entries(v).reduce((o, [k, v]) => {
        o[k] = isArray(v) ? filterDeep(v as Array<any>, cb) : v;

        return o;
      }, {}));
    }
  }

  return res;
};

export const findDeep = (
  arr: Array<any> = [],
  cb: (v?: any) => boolean = () => true,
  depth: (v: any) => any = v => v,
  multiple: boolean = false,
): Array<any> => {
  const res = [];

  for (const v of arr) {
    const d = depth(v);

    if (Array.isArray(d)) {
      if (multiple) {
        res.push(...findDeep(d, cb, depth, multiple));
      } else {
        return findDeep(d, cb, depth);
      }
    } else if (cb(v)) {
      if (multiple) {
        res.push(v);
      } else {
        return v;
      }
    }
  }

  if (res.length && multiple) {
    return res;
  }
};
