export declare interface COLORS {
  [key: string]: {
    DEFAULT?: string,
    hover?: string,
    active?: string,
    disabled?: string,
    background?: string,
  } | string
}

export type COLOR_PARSERS = Array<{
  parse: ((r: string, g: string, b: string, a?: string) => {
    r: number;
    g: number;
    b: number;
    a: number;
  }) | ((h: string, s: string, l: string, a?: string) => {
    h: number;
    s: number;
    l: number;
    a: number;
  }),
  regex: RegExp,
}>;

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
