import {
  classNames,
  addClass,
  removeClass,
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
  fromPairs,
  mergeDeep,
  filterDeep,
  findDeep,
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

  describe('addClass(element, class)', () => {
    it('should correctly add a class to an element', () => {
      const elmt = { className: '' };
      addClass(elmt, 'test');
      expect(elmt.className).toBe('test');
    });

    it('should not add the same class twice', () => {
      const elmt = { className: 'test' };
      addClass(elmt, 'test');
      expect(elmt.className).toBe('test');
    });

    it('should correctly add a class to an element alongside other ' +
      'classes', () => {
      const elmt = { className: 'foo bar' };
      addClass(elmt, 'test');
      expect(elmt.className).toBe('foo bar test');
    });
  });

  describe('removeClass(element, class)', () => {
    it('should correctly remove an existing class from an element ' +
      '(in between)', () => {
      const elmt = { className: 'foo bar test' };
      removeClass(elmt, 'bar');
      expect(elmt.className).toBe('foo test');
    });

    it('should correctly remove an existing class from an element ' +
      '(start)', () => {
      const elmt = { className: 'foo bar test' };
      removeClass(elmt, 'foo');
      expect(elmt.className).toBe('bar test');
    });

    it('should correctly remove an existing class from an element ' +
      '(end)', () => {
      const elmt = { className: 'foo bar test' };
      removeClass(elmt, 'test');
      expect(elmt.className).toBe('foo bar');
    });

    it('should correctly remove all classes from an element', () => {
      const elmt = { className: 'foo' };
      removeClass(elmt, 'foo');
      expect(elmt.className).toBe('');
    });

    it('should correctly remove an existing class using classList', () => {
      const elmt = { classList: {
        classes: ['foo', 'bar', 'test'],
        remove: function (cls) {
          this.classes = this.classes.filter(c => c !== cls);
        },
      } };
      removeClass(elmt, 'bar');
      expect(elmt.classList.classes).toMatchObject(['foo', 'test']);
    });
  });

  describe('mockState(state, action)', () => {
    it('should merge state with action object to simulate setState', () => {
      expect(mockState({ foo: 'bar' }, { foo: 'test' }))
        .toMatchObject({ foo: 'test' });
    });

    it('should allow to use a function to compute new state', () => {
      expect(mockState({ foo: 'bar' }, state => ({ foo: state.foo + 'test' })))
        .toMatchObject({ foo: 'bartest' });
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

    it('should not try to get a value inside the default value', () => {
      expect(get({}, 'foo.bold', 'Default value')).toBe('Default value');
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
      expect(omitBy(foo, v => v < 5))
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

    it('should not override undefined values with plain objects', () => {
      const obj = { foo: undefined };
      const newObj = cloneDeep(obj);
      expect(newObj).not.toBe(obj);
      expect(newObj.foo).toBeUndefined();
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

  describe('fromPairs()', () => {
    it('should allow to make an object from an array', () => {
      const arr = [['foo', 'bar'], ['stuff', 'thing'], [0, true]];
      const obj = fromPairs(arr);
      expect(obj.foo).toBe('bar');
      expect(obj.stuff).toBe('thing');
      expect(obj[0]).toBe(true);

      expect(fromPairs()).toMatchObject({});
    });
  });

  describe('mergeDeep(target, source)', () => {
    it('should correctly merge objects', () => {
      expect(mergeDeep({}, { foo: 'bar' })).toMatchObject({ foo: 'bar' });
      expect(mergeDeep({ foo: 'bar' }, { foo: 'test' }))
        .toMatchObject({ foo: 'test' });
      expect(mergeDeep({ foo: { bar: 'test' } }, { foo: { bar: 'stuff' } }))
        .toMatchObject({ foo: { bar: 'stuff' } });
      expect(mergeDeep({ foo: 0 }, { bar: 1 }))
        .toMatchObject({ foo: 0, bar: 1 });

      const date = new Date();
      expect(mergeDeep(date, { foo: 'bar' })).toBe(date);
      expect(mergeDeep({ foo: 'bar' }, date)).toMatchObject({ foo: 'bar' });

      expect(mergeDeep([0, 1], [2, 3])).toMatchObject([0, 1, 2, 3]);
      expect(mergeDeep([0, 1], { foo: 'bar' }))
        .toMatchObject([0, 1, { foo: 'bar' }]);
      expect(mergeDeep({ foo: [0, 1] }, { foo: [2, 3, { bar: 'stuff' }] }))
        .toMatchObject({ foo: [0, 1, 2, 3, { bar: 'stuff' }] });
    });
  });

  describe('filterDeep(array, cb, hasDepth', () => {
    it('should correctly filter things deep inside deep arrays', () => {
      const arr = [0, 1, [2, 3, [4, 5, [6, 7, [8, 9]]]]];
      expect(filterDeep(arr, v => v % 2 === 0, v => v))
        .toMatchObject([0, [2, [4, [6, [8]]]]]);
      const arr2 = [{ options: ['Item 1', 'Item 2', 'Bar'] }, 'Item 3', 'Foo'];
      expect(filterDeep(arr2, v => /Item/.test(v), v => v.options, true))
        .toMatchObject([{ options: ['Item 1', 'Item 2'] }, 'Item 3']);
    });
  });

  describe('findDeep(array, cb, hasDepth)', () => {
    it('should correctly find an element inside deep arrays', () => {
      const arr = [0, 1, [2, 3, [4, 5, [6, 7, [8, 9]]]]];
      expect(findDeep(arr, v => v === 7)).toBe(7);

      const arr2 = [{ options: ['Item 1', 'Item 2', 'Bar'] }, 'Item 3', 'Foo'];
      expect(findDeep(arr2, v => /Item/.test(v), v => v.options))
        .toBe('Item 1');
    });

    it('should correctly find multiple elements inside deep arrays', () => {
      const arr = [0, 1, [2, 3, [4, 5, [6, 7, [8, 9]]]]];
      expect(findDeep(arr, v => v % 2 === 0, v => v, true))
        .toMatchObject([0, 2, 4, 6, 8]);

      const arr2 = [{ options: ['Item 1', 'Item 2', 'Bar'] }, 'Item 3', 'Foo'];
      expect(findDeep(arr2, v => /Item/.test(v), v => v.options, true))
        .toMatchObject(['Item 1', 'Item 2', 'Item 3']);
    });
  });
});
