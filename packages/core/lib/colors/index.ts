export const COLORS = {
  // Primary
  velvet: {
    DEFAULT: '#5C56DF',
    hover: '#807BFC',
    active: '#4D47CB',
    disabled: '#D6D4F7',
    background: '#F6F6FD',
  },
  lime: {
    DEFAULT: '#7ED496',
    hover: '#A7E0B7',
    active: '#60B678',
    disabled: '#EAF8EE',
    background: '#F2F9F4',
  },
  grapefruit: {
    DEFAULT: '#EE7674',
    hover: '#F28B89',
    active: '#D36664',
    disabled: '#FCE9E9',
    background: '#FAEEEE',
  },
  sunglow: {
    DEFAULT: '#FFB800',
    hover: '#FFD66D',
    active: '#EA9A00',
    disabled: '#FFF4D6',
    background: '#FFFAED',
  },

  // Text
  onyx: '#1A1A1A',
  tundora: '#424242',

  // Neutral
  seashell: '#FEFEFE',
  alabaster: '#FCFCFC',
  concrete: '#F3F3F3',
  mischka: '#DFE1E6',
  slate: '#6B778C',

  // Dark mode
  'dark-velvet-disabled': '#424078',
  'dark-velvet-background': '#2A284B',
  'dark-velvet-foreground': '#3C3886',

  'dark-lime-disabled': '#51725A',
  'dark-lime-background': '#202d24',
  'dark-lime-foreground': '#51845F',

  'dark-grapefruit-disabled': '#8D5454',
  'dark-grapefruit-background': '#5E4343',
  'dark-grapefruit-foreground': '#A45C5C',

  'dark-sunglow-disabled': '#756333',
  'dark-sunglow-background': '#4D4634',
  'dark-sunglow-foreground': '#B2974B',

  nevada: '#646873',
  gondola: '#1E1E1E',
};

export interface hsva {
  h?: number;
  s?: number;
  v?: number;
  a?: number;
}

export interface hsla {
  h?: number;
  s?: number;
  l?: number;
  a?: number;
}

export interface rgba {
  r?: number;
  g?: number;
  b?: number;
  a?: number;
}

export interface rgb {
  r?: number;
  g?: number;
  b?: number;
}

const COLOR_PARSERS = [{
  // eslint-disable-next-line @stylistic/max-len
  regex: /(?:rgb)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*%?,\s*(\d{1,3})\s*%?(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
  parse: (r: string, g: string, b: string, a: string) => ({
    r: parseInt(r, 10) / 255,
    g: parseInt(g, 10) / 255,
    b: parseInt(b, 10) / 255,
    a: isNaN(parseFloat(a)) ? 1 : parseFloat(a),
  }),
}, {
  // eslint-disable-next-line @stylistic/max-len
  regex: /(?:hsl)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
  parse: (h: string, s: string, l: string, a: string) => ({
    h: parseInt(h, 10) / 360,
    s: parseInt(s, 10) / 100,
    l: parseInt(l, 10) / 100,
    a: isNaN(parseFloat(a)) ? 1 : parseFloat(a),
  }),
}, {
  regex: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/,
  parse: (r: string, g: string, b: string) => ({
    r: parseInt(r, 16) / 255,
    g: parseInt(g, 16) / 255,
    b: parseInt(b, 16) / 255,
    a: 1,
  }),
}, {
  regex: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/,
  parse: (r: string, g: string, b: string) => ({
    r: parseInt(r + r, 16) / 255,
    g: parseInt(g + g, 16) / 255,
    b: parseInt(b + b, 16) / 255,
    a: 1,
  }),
}];

export const hsva2hsla = ({ h, s, v, a }: hsva): hsla => {
  if (v === 0) {
    // HSVA brightness goes from black (0) to transparent (1)
    // So if HSVA brightness is 0, HSLA should be full black, making saturation
    // useless
    return { h, s: 0, l: 0, a };
  } else if (s === 0 && v === 1) {
    // HSVA saturation goes from white (0) to transparent (1)
    // HSLA saturation goes from grey (0) to transparent (1)
    // So if HSVA saturation is 0 and brightness (b or v) is 1, HSLA saturation
    // should be transparent and lightness to 1 to render white anyway
    return { h, s: 1, l: 1, a };
  } else {
    const l = v * (2 - s) / 2;

    return {
      h,
      s: v * s / (1 - Math.abs(2 * l - 1)),
      l,
      a,
    };
  }
};

export const hsla2hsva = ({ h, s, l, a }: hsla): hsva => {
  s = Math.min(s, 1);
  l = Math.min(l, 1);
  a = Math.min(a, 1);

  if (l === 0) {
    // Opposite of hsva2hsla:
    // If HSLA lightness is 0, current color is black so HSVA saturation
    // and brightness should be 0
    return { h, s: 0, v: 0, a };
  } else {
    const v = l + s * (1 - Math.abs(2 * l - 1)) / 2;

    return {
      h,
      s: 2 * (v - l) / v,
      v,
      a,
    };
  }
};

// This one was taken from the interwebs but can't remember where
// If you are its author, please let me know :)
export const hsva2rgba = ({ h, s, v, a = 0 }: hsva = {}): rgba => {
  let r, g, b;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v; g = t; b = p;
      break;
    case 1:
      r = q; g = v; b = p;
      break;
    case 2:
      r = p; g = v; b = t;
      break;
    case 3:
      r = p; g = q; b = v;
      break;
    case 4:
      r = t; g = p; b = v;
      break;
    case 5:
      r = v; g = p; b = q;
      break;
    default:
      r = 0; g = 0; b = 0;
  }

  return { r, g, b, a };
};

export const rgba2hsva = ({ r, g, b, a = 0 }: rgba = {}): hsva => {
  r = Math.min(r, 1);
  g = Math.min(g, 1);
  b = Math.min(b, 1);
  a = Math.min(a, 1);

  let h;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max || 0;
  const d = max - min;

  const s = max === 0 || isNaN(max) ? 0 : d / max || 0;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }

    h /= 6;
  }

  return { h, s, v, a };
};

export const rgba2hex = ({ r, g, b }: rgb): string =>
  '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).substr(1);

export const denormalizeHSLA = ({ h, s, l, a }: hsla): hsla => ({
  h: Math.round(h * 360),
  s: Math.round(s * 100),
  l: Math.round(l * 100),
  a,
});

export const denormalizeHSVA = ({ h, s, v, a }: hsva): hsva => ({
  h: Math.round(h * 360),
  s: Math.round(s * 100),
  v: Math.round(v * 100),
  a,
});

export const denormalizeRGBA = ({ r, g, b, a }: rgba): rgba => ({
  r: Math.round(r * 255),
  g: Math.round(g * 255),
  b: Math.round(b * 255),
  a,
});

export const parseColor = (color: string = '') => {
  color = color.toLowerCase();
  let hsva = null;

  for (const parser of COLOR_PARSERS) {
    const match = parser.regex.exec(color);
    const parsed = match && parser.parse(
      ...match.slice(1) as [string, string, string, string]
    );

    if (parsed) {
      /* istanbul ignore else: ignored unrecognized format */
      if (typeof (parsed as rgba).r !== 'undefined') {
        hsva = rgba2hsva(parsed);
      } else if ((parsed as hsla).l) {
        hsva = hsla2hsva(parsed);
      }

      return hsva;
    }
  }

  return hsva;
};

export const stringifyColor = (
  color: hsla | hsva | rgba,
  format: string = 'auto'
) => {
  if (format === 'auto') {
    format = color.a < 1 ? 'rgba' : 'hex';
  }

  switch (format) {
    case 'hsl':
    case 'hsla': {
      const hsla = denormalizeHSLA(hsva2hsla(color));

      return `hsl${color.a < 1 ? 'a' : ''}(` +
        `${hsla.h}, ` +
        `${hsla.s}%, ` +
        `${hsla.l}%` +
        (color.a < 1 ? `, ${parseFloat(hsla.a.toFixed(2))}` : '') +
        ')';
    }
    case 'rgb':
    case 'rgba': {
      const rgba = denormalizeRGBA(hsva2rgba(color));

      return `rgb${color.a < 1 ? 'a' : ''}(` +
        `${rgba.r}, ` +
        `${rgba.g}, ` +
        `${rgba.b}` +
        (color.a < 1 ? `, ${parseFloat(rgba.a.toFixed(2))}` : '') +
        ')';
    }
    default:
      return rgba2hex(denormalizeRGBA(hsva2rgba(color)));
  }
};
