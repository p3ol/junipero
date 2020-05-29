import { classNames, mockState } from './';

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
});
