export const COLORS: Object;

export const COLOR_PARSERS: Array<Object>;

export function hsva2hsla({ h, s, v, a }: {
  h: number;
  s: number;
  v: number;
  a: number;
}): {
  h: number;
  s: number;
  l: number;
  a: number;
};

export function hsla2hsva({ h, s, l, a }: {
  h: number;
  s: number;
  l: number;
  a: number;
}): {
  h: number;
  s: number;
  v: number;
  a: number;
};

export function hsva2rgba({ h, s, v, a }?: {
  h: number;
  s: number;
  v: number;
  a?: number;
}): {
  r: number;
  g: number;
  b: number;
  a: number;
};

export function rgba2hsva({ r, g, b, a }?: {
  r: number;
  g: number;
  b: number;
  a?: number;
}): {
  h: number;
  s: number;
  v: number;
  a: number;
};
export function rgba2hex({ r, g, b }: {
  r: number;
  g: number;
  b: number;
}): string;

export function denormalizeHSLA({ h, s, l, a }: {
  h: number;
  s: number;
  l: number;
  a: number;
}): {
  h: number;
  s: number;
  l: number;
  a: number;
};

export function denormalizeHSVA({ h, s, v, a }: {
  h: number;
  s: number;
  v: number;
  a: number;
}): {
  h: number;
  s: number;
  v: number;
  a: number;
};

export function denormalizeRGBA({ r, g, b, a }: {
  r: number;
  g: number;
  b: number;
  a: number;
}): {
  r: number;
  g: number;
  b: number;
  a: number;
};

export function parseColor(color?: string): {
  h: number;
  s: number;
  v: number;
  a: number;
};

export function stringifyColor(color: any, format?: string): string;
