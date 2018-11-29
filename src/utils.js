export const COLOR_PARSERS = [{
  regex: /(rgb)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*%?,\s*(\d{1,3})\s*%?(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
  parse: ([useless, alsoUseless, r, g, b, a]) => ({
    r: parseInt(r, 10) / 255,
    g: parseInt(g, 10) / 255,
    b: parseInt(b, 10) / 255,
    a: isNaN(parseFloat(a)) ? 1 : parseFloat(a),
  }),
}, {
  regex: /(hsl)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
  parse: ([useless, alsoUseless, h, s, l, a]) => ({
    h: parseInt(h, 10) / 360,
    s: parseInt(s, 10) / 100,
    l: parseInt(l, 10) / 100,
    a: isNaN(parseFloat(a)) ? 1 : parseFloat(a),
  }),
}, {
  regex: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/,
  parse: ([useless, r, g, b]) => ({
    r: parseInt(r, 16) / 255,
    g: parseInt(g, 16) / 255,
    b: parseInt(b, 16) / 255,
    a: 1,
  }),
}, {
  regex: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/,
  parse: ([useless, r, g, b]) => ({
    r: parseInt(r + r, 16) / 255,
    g: parseInt(g + g, 16) / 255,
    b: parseInt(b + b, 16) / 255,
    a: 1,
  }),
}];

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

export const omit = (obj, keys = []) => {
  const res = {};
  Object.entries(obj).forEach((item) => {
    if (!keys.includes(item[0])) {
      res[item[0]] = item[1];
    }
  });
  return res;
};

export const hsva2hsla = ({ h, s, v, a }) => {
  if (v === 0) {
    return { h, s: 0, l: 0, a };
  } else if (s === 0 && v === 1) {
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

export const hsla2hsva = ({ h, s, l, a }) => {
  h = Math.min(h, 1);
  s = Math.min(s, 1);
  l = Math.min(l, 1);
  a = Math.min(a, 1);

  if (l === 0) {
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

export const hsva2rgba = ({ h, s, v, a }) => {
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

export const rgba2hsva = ({ r, g, b, a }) => {
  r = Math.min(r, 1);
  g = Math.min(g, 1);
  b = Math.min(b, 1);
  a = Math.min(a, 1);

  let h, s;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;
  const d = max - min;

  s = max == 0 ? 0 : d / max;

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

/* eslint-disable no-bitwise */
export const rgba2hex = ({ r, g, b, a }) => (
  '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).substr(1)
);
/* eslint-enable no-bitwise */

export const denormalizeHSLA = ({ h, s, l, a }) => ({
  h: Math.round(h * 360),
  s: Math.round(s * 100),
  l: Math.round(l * 100),
  a,
});

export const denormalizeRGBA = ({ r, g, b, a }) => ({
  r: Math.round(r * 255),
  g: Math.round(g * 255),
  b: Math.round(b * 255),
  a,
});

export const parseColor = (color = '') => {
  color = color.toLowerCase();
  let hsva;

  for (const parser of COLOR_PARSERS) {
    const match = parser.regex.exec(color);
    const parsed = match && parser.parse(match);

    if (parsed) {
      if (typeof parsed.r !== 'undefined') {
        hsva = rgba2hsva(parsed);
      } else if (parsed.l) {
        hsva = hsla2hsva(parsed);
      }

      return hsva;
    }
  }

  return hsva;
};

export const stringifyColor = (color, format = 'auto') => {
  if (format === 'auto') {
    format = color.a < 1 ? 'rgba' : 'hex';
  }

  switch (format) {
    case 'hsla':
      const hsla = denormalizeHSLA(hsva2hsla(color));
      return `hsl${color.a < 1 ? 'a' : ''}(` +
        `${hsla.h}%,` +
        `${hsla.s}%,` +
        `${hsla.l}%` +
        (color.a < 1 ? `, ${hsla.a}` : '') +
        ')';
    case 'rgba':
      const rgba = denormalizeRGBA(hsva2rgba(color));
      return `rgb${color.a < 1 ? 'a' : ''}(` +
        `${rgba.r},` +
        `${rgba.g},` +
        `${rgba.b}` +
        (color.a < 1 ? `, ${rgba.a.toFixed(2)}` : '') +
        ')';
    default:
      return rgba2hex(denormalizeRGBA(hsva2rgba(color)));
  }
};
