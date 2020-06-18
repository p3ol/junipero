import {
  classNames,
  mockState,
  exists,
  isUndefined,
  isNull,
  ensureNode,
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
  addMonths,
  subMonths,
  ensureMinMax,
  getFloatPrecision,
} from './';

describe('utils', () => {
  describe('classNames(...classes)', () => {
    it('should merge arguments into a list of css classes', () => {
      expect(classNames('test', 'secondTest')).toBe('test secondTest');
    });

    it('should ignore falsy arguments when compiling arguments', () => {
      const secondTest = null;
      const thirdTest = undefined;
      const fourthTest = false;
      expect(classNames('test', secondTest, thirdTest, fourthTest))
        .toBe('test');
    });

    it('should allow to use an object argument to defined classes based on ' +
      'conditions', () => {
      const secondTest = true;
      expect(classNames('test', { secondTest })).toBe('test secondTest');
    });

    it('should merge classes if argument is an array', () => {
      const thirdTest = false;
      expect(classNames('test', ['secondTest'], [{ thirdTest }, 'fourthTest']))
        .toBe('test secondTest fourthTest');
    });

    it('should do nothing of a not truthy value', () => {
      expect(classNames('test', ['secondTest'], [null]))
        .toBe('test secondTest');
    });

    it('should do nothing of a non object-like structure', () => {
      expect(classNames('test', ['secondTest'], true))
        .toBe('test secondTest');
    });
  });

  describe('mockState(state, action)', () => {
    it('should merge state with action object to simulate setState', () => {
      expect(mockState({ foo: 'bar' }, { foo: 'test' }))
        .toMatchObject({ foo: 'test' });
    });
  });

  describe('isNull(value)', () => {
    it('should return true when value is null', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false when value is undefined', () => {
      expect(isNull()).toBe(false);
    });

    it('should return false when value is defined and not null', () => {
      expect(isNull(true)).toBe(false);
    });
  });

  describe('isUndefined(value)', () => {
    it('should return true when value is undefined', () => {
      expect(isUndefined()).toBe(true);
    });

    it('should return false when value is null', () => {
      expect(isUndefined(null)).toBe(false);
    });

    it('should return false when value is defined and not null', () => {
      expect(isUndefined(true)).toBe(false);
    });
  });

  describe('exists(value)', () => {
    it('should return true when value is defined and not null', () => {
      expect(exists(0)).toBe(true);
    });

    it('should return false when value is null', () => {
      expect(exists(null)).toBe(false);
    });

    it('should return false when value is not defined', () => {
      expect(exists()).toBe(false);
    });
  });

  describe('ensureNode(container)', () => {
    it('should return the same element if passed as argument', () => {
      const elmt = document.createElement('a');
      expect(ensureNode(elmt)).toBe(elmt);
    });

    it('should return a new element if container is a string and is not found' +
      'in DOM', () => {
      expect(ensureNode('stuff')).toBeDefined();
    });

    it('should return an existing element if container is a string and it is ' +
      'found in DOM', () => {
      const body = document.body;
      expect(ensureNode('body')).toBe(body);
    });
  });

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
      const hex = rgba2hex({ r: 77, g: 179, b: 102, a: 1 });
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

  describe('addMonths(date, amount)', () => {
    it('should allow to add a month to a date', () => {
      expect(addMonths(new Date(2020, 0, 1), 1).getMonth()).toBe(1);
    });

    it('should allow to add several months to a date', () => {
      expect(addMonths(new Date(2020, 0, 1), 5).getMonth()).toBe(5);
    });

    it('should add a year if months go over 12', () => {
      expect(addMonths(new Date(2020, 10, 1), 29).getFullYear()).toBe(2023);
      expect(addMonths(new Date(2020, 10, 1), 29).getMonth()).toBe(3);
    });
  });

  describe('subMonths(date, amount)', () => {
    it('should allow to sub a month to a date', () => {
      expect(subMonths(new Date(2020, 1, 1), 1).getMonth()).toBe(0);
    });

    it('should allow to sub several months to a date', () => {
      expect(subMonths(new Date(2020, 6, 1), 5).getMonth()).toBe(1);
    });

    it('should sub one or several years if months go over 12', () => {
      expect(subMonths(new Date(2020, 10, 1), 29).getFullYear()).toBe(2018);
      expect(subMonths(new Date(2020, 10, 1), 29).getMonth()).toBe(5);
    });
  });

  describe('getFloatPrecision(value)', () => {
    it('should detect decimals from number', () => {
      expect(getFloatPrecision(1.4345)).toBe(4);
      expect(getFloatPrecision(1)).toBe(0);
    });
  });

  describe('ensureMinMax(value, min, max)', () => {
    it('should return value if between min and max', () => {
      expect(ensureMinMax(10, 0, 100)).toBe(10);
    });

    it('should return min if value is inferior', () => {
      expect(ensureMinMax(-23, 0, 100)).toBe(0);
    });

    it('should return min if value is superior', () => {
      expect(ensureMinMax(145, 0, 100)).toBe(100);
    });

    it('should work evey if nothing is passed in args', () => {
      expect(ensureMinMax()).toBe(0);
    });
  });
});
