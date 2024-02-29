import {
  ensureMinMax,
  getFloatPrecision,
  formatThousand,
} from '.';

describe('numbers', () => {
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

  describe('formatThousand(value)', () => {
    it('should format a big number with thousand separators', () => {
      expect(formatThousand(10000000)).toBe('10 000 000');
    });
    it('should also allow to format floats', () => {
      expect(formatThousand(10000000.33)).toBe('10 000 000.33');
    });
  });
});
