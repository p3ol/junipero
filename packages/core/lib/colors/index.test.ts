import {
  hsva2hsla,
  hsla2hsva,
  hsva2rgba,
  rgba2hex,
  rgba2hsva,
  denormalizeHSLA,
  denormalizeHSVA,
  denormalizeRGBA,
  parseColor,
  stringifyColor,
} from '.';

describe('colors', () => {
  describe('hsva2hsla({ h, s, v, a })', () => {
    it('should transform simple HSVA values into HSLA', () => {
      const { h, s, l, a } = hsva2hsla({ h: 360, s: 0.5, v: 0.5, a: 1 });
      expect(h).toBe(360);
      expect(s.toFixed(2)).toBe('0.33');
      expect(l.toFixed(2)).toBe('0.38');
      expect(a).toBe(1);
    });

    it('should set output `s` and `l` to 0 if input `v` is 0', () => {
      const { h, s, l, a } = hsva2hsla({ h: 360, s: 0.5, v: 0, a: 1 });
      expect(h).toBe(360);
      expect(s).toBe(0);
      expect(l).toBe(0);
      expect(a).toBe(1);
    });

    it('should set output `s` and `l` to 1 if input `s` is 0 and input `v` ' +
      'is 1', () => {
      const { h, s, l, a } = hsva2hsla({ h: 360, s: 0, v: 1, a: 1 });
      expect(h).toBe(360);
      expect(s).toBe(1);
      expect(l).toBe(1);
      expect(a).toBe(1);
    });
  });

  describe('hsla2hsva({ h, s, l, a })', () => {
    it('should transform simple HSLA values into HSVA', () => {
      const { h, s, v, a } = hsla2hsva({ h: 360, s: 0.5, l: 0.5, a: 1 });
      expect(h).toBe(360);
      expect(s.toFixed(2)).toBe('0.67');
      expect(v.toFixed(2)).toBe('0.75');
      expect(a).toBe(1);
    });

    it('should set output `s` and `v` to 0 if input `l` is 0', () => {
      const { h, s, v, a } = hsla2hsva({ h: 360, s: 0.5, l: 0, a: 1 });
      expect(h).toBe(360);
      expect(s).toBe(0);
      expect(v).toBe(0);
      expect(a).toBe(1);
    });
  });

  describe('hsva2rgba({ h, s, v, a })', () => {
    it('should transform simple HSVA values into RGBA', () => {
      const { r, g, b, a } = hsva2rgba({ h: 360, s: 0.5, v: 0.5, a: 1 });
      expect(r).toBe(0.5);
      expect(g).toBe(0.25);
      expect(b).toBe(0.25);
      expect(a).toBe(1);
    });

    it('should be able to transform correctly arbritrary values 1/3', () => {
      const { r, g, b, a } = hsva2rgba({ h: 6.18, s: 0.5, v: 0.5, a: 1 });
      expect(r).toBe(0.4800000000000004);
      expect(g).toBe(0.5);
      expect(b).toBe(0.25);
      expect(a).toBe(1);
    });

    it('should be able to transform correctly arbritrary values 2/3', () => {
      const { r, g, b, a } = hsva2rgba({ h: 6.67, s: 0.5, v: 0.5, a: 1 });
      expect(r).toBe(0.254999999999999);
      expect(g).toBe(0.25);
      expect(b).toBe(0.5);
      expect(a).toBe(1);
    });

    it('should be able to transform correctly arbritrary values 3/3', () => {
      const { r, g, b, a } = hsva2rgba({ h: 6.84, s: 0.5, v: 0.5, a: 1 });
      expect(r).toBe(0.5);
      expect(g).toBe(0.25);
      expect(b).toBe(0.4900000000000002);
      expect(a).toBe(1);
    });

    it('should be able to work with no values at all', () => {
      const { r, g, b, a } = hsva2rgba();
      expect(r).toBe(0);
      expect(g).toBe(0);
      expect(b).toBe(0);
      expect(a).toBe(0);
    });
  });

  describe('rgba2hsva({ r, g, b, a })', () => {
    it('should transform simple RGBA values into HSVA 1/4', () => {
      const { h, s, v, a } = rgba2hsva({ r: 0.3, g: 0.7, b: 0.4, a: 1 });
      expect(h * 360).toBe(135);
      expect(s.toFixed(2)).toBe('0.57');
      expect(v.toFixed(2)).toBe('0.70');
      expect(a).toBe(1);
    });

    it('should transform simple RGBA values into HSVA 2/4', () => {
      const { h, s, v, a } = rgba2hsva({ r: 0.7, g: 0.3, b: 0.4, a: 1 });
      expect(h * 360).toBe(345);
      expect(s.toFixed(2)).toBe('0.57');
      expect(v.toFixed(2)).toBe('0.70');
      expect(a).toBe(1);
    });

    it('should transform simple RGBA values into HSVA 3/4', () => {
      const { h, s, v, a } = rgba2hsva({ r: 0.3, g: 0.4, b: 0.7, a: 1 });
      expect(h * 360).toBe(225);
      expect(s.toFixed(2)).toBe('0.57');
      expect(v.toFixed(2)).toBe('0.70');
      expect(a).toBe(1);
    });

    it('should transform simple RGBA values into HSVA 4/4', () => {
      const { h, s, v, a } = rgba2hsva({ r: 0.1, g: 0.1, b: 0.1, a: 1 });
      expect(h * 360).toBe(0);
      expect(s.toFixed(2)).toBe('0.00');
      expect(v.toFixed(2)).toBe('0.10');
      expect(a).toBe(1);
    });

    it('should transform empty values into HSVA', () => {
      const { h, s, v, a } = rgba2hsva();
      expect(h * 360).toBe(0);
      expect(s.toFixed(2)).toBe('0.00');
      expect(v.toFixed(2)).toBe('0.00');
      expect(a).toBe(0);
    });
  });

  describe('rgba2hex({ r, g, b, a })', () => {
    it('should transform simple RGBA values into an HEX string', () => {
      const hex = rgba2hex({ r: 77, g: 179, b: 102 });
      expect(hex).toBe('#4db366');
    });
  });

  describe('denormalizeHSLA({ h, s, l, a })', () => {
    it('should denormalize HSLA 0-1 values', () => {
      const { h, s, l, a } = denormalizeHSLA({ h: 0.3, s: 0.2, l: 0.5, a: 1 });
      expect(h).toBe(108);
      expect(s).toBe(20);
      expect(l).toBe(50);
      expect(a).toBe(1);
    });
  });

  describe('denormalizeHSVA({ h, s, v, a })', () => {
    it('should denormalize HSVA 0-1 values', () => {
      const { h, s, v, a } = denormalizeHSVA({ h: 0.3, s: 0.2, v: 0.5, a: 1 });
      expect(h).toBe(108);
      expect(s).toBe(20);
      expect(v).toBe(50);
      expect(a).toBe(1);
    });
  });

  describe('denormalizeRGBA({ r, g, b, a })', () => {
    it('should denormalize RGBA 0-1 values', () => {
      const { r, g, b, a } = denormalizeRGBA({ r: 0.3, g: 0.2, b: 0.5, a: 1 });
      expect(r).toBe(77);
      expect(g).toBe(51);
      expect(b).toBe(128);
      expect(a).toBe(1);
    });
  });

  describe('parseColor(color = "")', () => {
    it('should parse a rgb(77, 179, 102) color string into HSVA', () => {
      const { h, s, v, a } = denormalizeHSVA(parseColor('rgb(77, 179, 102)'));
      expect(h).toBe(135);
      expect(s).toBe(57);
      expect(v).toBe(70);
      expect(a).toBe(1);
    });

    it('should parse a rgba(77, 179, 102, 0.5) color string into HSVA', () => {
      const {
        h, s, v, a,
      } = denormalizeHSVA(parseColor('rgba(77, 179, 102, 0.5)'));
      expect(h).toBe(135);
      expect(s).toBe(57);
      expect(v).toBe(70);
      expect(a).toBe(0.5);
    });

    it('should parse an hsl(135, 40%, 50%) color string into HSVA', () => {
      const {
        h, s, v, a,
      } = denormalizeHSVA(parseColor('hsl(135, 40%, 50%)'));
      expect(h).toBe(135);
      expect(s).toBe(57);
      expect(v).toBe(70);
      expect(a).toBe(1);
    });

    it('should parse an hsla(135, 40%, 50%, 0.5) color string into ' +
      'HSVA', () => {
      const {
        h, s, v, a,
      } = denormalizeHSVA(parseColor('hsla(135, 40%, 50%, 0.5)'));
      expect(h).toBe(135);
      expect(s).toBe(57);
      expect(v).toBe(70);
      expect(a).toBe(0.5);
    });

    it('should parse a #4db366 hex color string into HSVA', () => {
      const {
        h, s, v, a,
      } = denormalizeHSVA(parseColor('#4db366'));
      expect(h).toBe(135);
      expect(s).toBe(57);
      expect(v).toBe(70);
      expect(a).toBe(1);
    });

    it('should parse a #FBA hex color string into HSVA', () => {
      const {
        h, s, v, a,
      } = denormalizeHSVA(parseColor('#FBA'));
      expect(h).toBe(12);
      expect(s).toBe(33);
      expect(v).toBe(100);
      expect(a).toBe(1);
    });

    it('should return null if color scheme is not recognized', () => {
      const parsed = parseColor('cmyk(0, 0.267, 0.333, 0)');
      expect(parsed).toBe(null);
    });
  });

  describe('stringifyColor(color, format = "auto")', () => {
    it('should automatically stringify hsva values into an hex string', () => {
      const str = stringifyColor({ h: 0.375, s: 0.57, v: 0.7, a: 1 });
      expect(str).toBe('#4db366');
    });

    it('should automatically stringify hsva values into an rgba string if ' +
      'alpha < 1', () => {
      const str = stringifyColor({ h: 0.375, s: 0.57, v: 0.7, a: 0.5 });
      expect(str).toBe('rgba(77, 179, 102, 0.5)');
    });

    it('should stringify hsva values into an hsl string', () => {
      const str = stringifyColor({ h: 0.375, s: 0.57, v: 0.7, a: 1 }, 'hsl');
      expect(str).toBe('hsl(135, 40%, 50%)');
    });

    it('should automatically stringify hsva values into an hsla string if ' +
      'format is "hsl" and alpha < 1', () => {
      const str = stringifyColor({ h: 0.375, s: 0.57, v: 0.7, a: 0.5 }, 'hsl');
      expect(str).toBe('hsla(135, 40%, 50%, 0.5)');
    });

    it('should stringify hsva values into an rgb string', () => {
      const str = stringifyColor({ h: 0.375, s: 0.57, v: 0.7, a: 1 }, 'rgb');
      expect(str).toBe('rgb(77, 179, 102)');
    });

    it('should automatically stringify hsva values into an rgba string if ' +
      'format is "rgb" and alpha < 1', () => {
      const str = stringifyColor({ h: 0.375, s: 0.57, v: 0.7, a: 0.5 }, 'rgb');
      expect(str).toBe('rgba(77, 179, 102, 0.5)');
    });

    it('should stringify hsva values into an hex string', () => {
      const str = stringifyColor({ h: 0.375, s: 0.57, v: 0.7, a: 1 }, 'hex');
      expect(str).toBe('#4db366');
    });

    it('should ignore alpha when stringifying if output format is hex', () => {
      const str = stringifyColor({ h: 0.375, s: 0.57, v: 0.7, a: 0.5 }, 'hex');
      expect(str).toBe('#4db366');
    });
  });
});
