import {
  classNames,
  mockState,
  exists,
  isUndefined,
  isNull,
} from './';

describe('core', () => {
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
});
