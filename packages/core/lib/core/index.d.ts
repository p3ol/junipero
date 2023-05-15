export function classNames(...args: any[]): string;

export function addClass(elmt: Node, cls: any): void;

export function removeClass(elmt: any, cls: any): void;

export function mockState(state: any, action: any): any;

export function isUndefined(value: any): boolean;

export function isNull(value: any): boolean;

export function isArray(arr: any): boolean;

export function isObject(obj: any): boolean;

export function isDate(date: any): boolean;

export function exists(value: any): boolean;

export function get(obj?: {}, path?: string, defaultValue?: any): any;

export function set(
  obj: {},
  path: string,
  value: any,
  customizer?: (val: any) => any
): {};

export function omitBy(
  obj: {},
  filter: (value: any, key: any) => boolean
): {};

export function omit(obj?: {}, keys?: any[]): {};

export function pick(obj?: {}, keys?: any[]): any;

export function cloneDeep(obj: any): any;

export function fromPairs(pairs?: any[]): any;

export function mergeDeep(target: any, ...sources: any[]): any;

export function filterDeep(
  arr?: any[],
  filter?: (value: any) => boolean
): any[];

export function findDeep(
  arr?: any[],
  filter?: (value: any) => boolean,
  depth?: (value: any) => any,
  multiple?: boolean
): any;
