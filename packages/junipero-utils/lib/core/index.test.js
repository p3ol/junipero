import {
  classNames,
  mockState,
  exists,
  isUndefined,
  isNull,
  get,
  set,
  omit,
  omitBy,
  pick,
  cloneDeep,
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

  describe('get()', () => {
    it('should allow to get a value of a property in a given object', () => {
      const foo = { bar: 'test' };
      expect(get(foo, 'bar')).toBe('test');
    });

    it('should allow to get a value of a nested property in a given ' +
      'object', () => {
      const foo = { bar: { stuff: 'test' } };
      expect(get(foo, 'bar.stuff')).toBe('test');
    });

    it('should allow to get a particular value in an array', () => {
      const foo = ['bar', 'stuff', 'test'];
      expect(get(foo, '1')).toBe('stuff');
    });

    it('should allow to get a particular value in an array for a given ' +
      'object', () => {
      const foo = { bar: ['stuff', 'test'] };
      expect(get(foo, 'bar.0')).toBe('stuff');
    });

    // We need to go deeper
    it('should allow to get a particular value in a nested property in an ' +
      'array for a given array', () => {
      const foo = { bar: [{ stuff: 'test' }] };
      expect(get(foo, 'bar.0.stuff')).toBe('test');
    });

    it('should not throw an error if any given parameter is null or ' +
      'undefined', () => {
      let error;
      try {
        get();
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
    });

    it('should allow to get a default value when nested property is not ' +
      'found', () => {
      const foo = { bar: 'test' };
      expect(get(foo, 'bar.stuff', 'thing')).toBe('thing');
    });
  });

  describe('set()', () => {
    it('should allow to set the value of a property in a given object', () => {
      const foo = { bar: 'test' };
      set(foo, 'bar', 'stuff');
      expect(foo.bar).toBe('stuff');
    });

    it('should allow to set the value of a nested property in a given ' +
      'object', () => {
      const foo = { bar: { stuff: 'test' } };
      set(foo, 'bar.stuff', 'thing');
      expect(foo.bar.stuff).toBe('thing');
    });

    it('should allow to set a particular value in an array', () => {
      const foo = ['bar', 'stuff', 'test'];
      set(foo, '1', 'thing');
      expect(foo[1]).toBe('thing');
    });

    it('should allow to set a particular value in an array for a given ' +
      'object', () => {
      const foo = { bar: ['stuff', 'test'] };
      set(foo, 'bar.0', 'thing');
      expect(foo.bar[0]).toBe('thing');
    });

    // We need to go even deepier
    it('should allow to set a particular value in a nested property in an ' +
      'array for a given object', () => {
      const foo = { bar: [{ stuff: 'test' }] };
      set(foo, 'bar.0.stuff', 'thing');
      expect(foo.bar[0].stuff).toBe('thing');
    });

    it('should not throw an error if any given parameter is null or ' +
      'undefined', () => {
      let error;
      try {
        set();
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
    });

    it('should allow to set a value even when nested property is not ' +
      'found', () => {
      const foo = { bar: 'test' };
      set(foo, 'bar.0.stuff', 'thing');
      expect(foo.bar[0].stuff).toBe('thing');
    });
  });

  describe('omit()', () => {
    it('should allow to omit a value from an object', () => {
      const foo = { bar: 'stuff', thing: 'test' };
      expect(omit(foo, ['thing'])).toMatchObject({ bar: 'stuff' });
    });

    it('should not throw an error if any given parameter is null or ' +
      'undefined', () => {
      let error;
      try {
        omit();
        omit(null);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
    });
  });

  describe('omitBy()', () => {
    it('should allow to omit some pairs from an object', () => {
      const foo = { bar: 1, test: 10, thing: 3, stuff: 14 };
      expect(omitBy(foo, (k, v) => v > 5))
        .toMatchObject({ test: 10, stuff: 14 });
    });

    it('should not throw an error if any given parameter is null or ' +
      'undefined', () => {
      let error;
      try {
        omitBy();
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
    });
  });

  describe('pick()', () => {
    it('should allow to only get some pairs from an object', () => {
      const foo = { bar: 'test', thing: 'stuff', skywalker: null };
      expect(pick(foo, ['bar', 'skywalker', 'yoda']))
        .toMatchObject({ bar: 'test', skywalker: null });
    });

    it('should not throw an error if any given parameter is null or ' +
      'undefined', () => {
      let error;
      try {
        pick();
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
    });
  });

  describe('cloneDeep()', () => {
    it('should allow to clone an object with subproperties', () => {
      const obj = { foo: 'bar' };
      const newObj = cloneDeep(obj);
      newObj.foo = 'test';
      expect(newObj).not.toBe(obj);
      expect(obj.foo).toBe('bar');
    });

    it('should allow to clone an object with nested props', () => {
      const obj = { foo: { stuff: new Date(), bar: [{}] } };
      const newObj = cloneDeep(obj);
      expect(newObj).not.toBe(obj);
      expect(obj.foo.stuff).not.toBe(newObj.foo.stuff);
      expect(obj.foo.bar).not.toBe(newObj.foo.bar);
      expect(obj.foo.bar[0]).not.toBe(newObj.foo.bar[0]);
    });

    it('should not throw an error if any given parameter is null or ' +
      'undefined', () => {
      let error;
      try {
        cloneDeep();
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
    });
  });
});
