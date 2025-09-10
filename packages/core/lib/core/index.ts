import type { GenericObject } from '../types';

export const classNames = (...args: any[]): string => {
  const classes: string[] = [];

  args.map((arg: string) => {
    if (!arg) {
      return false;
    }

    if (typeof arg === 'string' || typeof arg === 'number') {
      classes.push('' + (arg || ''));
    } else if (Array.isArray(arg) && (arg as any[]).length) {
      const inner = classNames(...arg as string[]);

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
  if (!elmt.className.includes(cls)) {
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

export const isUndefined = (v?: any): boolean => typeof v === 'undefined';

export const isNull = (v?: any): boolean => v === null;

export const isArray = (a: any): boolean => Array.isArray(a);

export const isObject = (o: any): boolean =>
  typeof o === 'object' && o?.constructor?.name === 'Object';

export const isDate = (d: any): boolean => d instanceof Date;

export const exists = (v?: any): boolean => !isNull(v) && !isUndefined(v);

type Idx<T, K extends string> = K extends keyof T ? T[K] : never;

type DeepIndex<T, K extends string> = T extends object ? (
  K extends `${infer F}.${infer R}` ? DeepIndex<Idx<T, F>, R> : Idx<T, K>
) : never;

export function get <T extends Record<string, any>, D = any> (
  obj: T = {} as T,
  path: string = '',
  defaultValue?: D
): DeepIndex<T, typeof path> | D {
  return path
    .split('.')
    .reduce((a, c) => exists(a?.[c]) ? a[c] : undefined, obj) ?? defaultValue;
}

export function set <T extends Record<string, any>, U = any> (
  obj: T = {} as T,
  path: string = '',
  value?: any,
  customizer: <V = any>(val: V, subobj: any) => V = (val, _subobj) => val
): T | U {
  const pathArr = path.split('.');
  const subObj = pathArr
    .slice(0, -1)
    .reduce((a, c, i) => {
      if (a[c] && typeof a[c] === 'object') {
        return a[c];
      }

      Object.assign(a, { [c]: Math.abs(
        parseFloat(pathArr[i + 1])
      ) >> 0 === +pathArr[i + 1] ? [] : {} });

      return a[c];
    }, obj);

  subObj[pathArr.slice(-1)[0]] =
    customizer(value, subObj[pathArr.slice(-1)[0]]);

  return obj;
}

export function omitBy<T extends Record<string, any>> (
  obj: T = {} as T,
  cb?: (value: T[keyof T], key: keyof T) => any
): Partial<T> {
  return Object
    .entries(obj)
    .filter(([k, v]) => !cb(v, k))
    .reduce((res, [k, v]) => (
      Object.assign({} as Partial<T>, res, { [k]: v })
    ), {} as Partial<T>);
}

export function omit<
  T extends Record<string, any>,
  U extends keyof T,
> (
  obj: T = {} as T,
  keys: U[] = []
): Omit<T, U> {
  return omitBy(obj || {}, (_value, key) =>
    keys.includes(key)) as Exclude<T, U>;
}

export function pick<
  T extends Record<string, any>,
  U extends keyof T,
> (
  obj: T = {} as T,
  keys: U[] = []
): Pick<T, U> {
  return keys.reduce((res: T, k: keyof T) => {
    if (!isUndefined(obj[k])) {
      res[k] = obj[k];
    }

    return res;
  }, {} as T);
}

export function cloneDeep<T = any> (
  obj?: T
): T {
  return typeof obj !== 'object' || obj === null
    ? obj
    : isDate(obj)
      ? new Date((obj as unknown as Date).getTime()) as T
      : isArray(obj)
        ? [...(obj as any[]).map(o => cloneDeep<T>(o))] as T
        : Object.entries(obj).reduce((res: T, [k, v]) => {
          Object.assign(res, { [k]: cloneDeep(v) });

          return res;
        }, {} as T);
}

export const fromPairs = (
  pairs: [(string | number), any][] = []
): Record<string | number, any> =>
  pairs.reduce((res: Record<string, any>, [k, v]) => {
    res[k] = v;

    return res;
  }, {});

export function mergeDeep<T = any, U = any, V = any, W = any, X = any> (
  target: T,
  source?: U,
  source2?: V,
  source3?: W,
  source4?: X,
  ...sources: any[]
): T & U & V & W & X {
  const allSources = [
    source, source2 ?? [], source3 ?? [], source4 ?? [], ...sources,
  ];

  return isArray(target)
    ? (target as any).concat(...allSources)
    : isObject(target)
      ? allSources.reduce((s, source) => (
        isObject(source)
          ? Object.entries(source).reduce((t: Record<string, any>, [k, v]) => {
            /* istanbul ignore else: no else needed */
            if (isArray(t[k]) || isObject(t[k])) {
              t[k] = mergeDeep((target as GenericObject)[k], v);
            } else if (!t[k] || !isObject(t[k])) {
              t[k] = v;
            }

            return t;
          }, s)
          : s
      ), target)
      : target as T & U & V & W & X;
}

export function filterDeep <T extends any[]> (
  arr: T = [] as T,
  cb: (v?: T[keyof T]) => boolean = () => true
): T {
  const res = [] as T;

  for (const v of arr) {
    if (cb(v)) {
      res.push(v);
    } else if (isArray(v)) {
      const r = filterDeep(v, cb);
      res.push(r);
    } else if (isObject(v) && !isDate(v)) {
      res.push(Object
        .entries<typeof v>(v)
        .reduce((o: Record<string, any>, [k, v]) => {
          o[k] = isArray(v)
            ? filterDeep(v, cb) : v;

          return o;
        }, {}));
    }
  }

  return res;
}

export function findDeep <T extends any[]> (
  arr: T = [] as T,
  cb: (v?: any) => boolean = () => true,
  depth: (v: any) => any = v => v,
  multiple: boolean = false,
): T[keyof T] | T {
  const res = [] as T;

  for (const v of arr) {
    const d = depth(v);

    if (Array.isArray(d)) {
      if (multiple) {
        res.push(...findDeep(d, cb, depth, multiple));
      } else {
        const res = findDeep(d, cb, depth);

        if (res) {
          return res;
        }
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
}
