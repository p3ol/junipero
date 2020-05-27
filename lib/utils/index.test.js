import { classNames } from './';

describe('classNames(...classes)', () => {

  it('should merge arguments into a list of css classes', () => {
    expect(classNames('test', 'secondTest')).toBe('test secondTest');
  });

  it('should ignore falsy arguments when compiling arguments', () => {
    const secondTest = null;
    const thirdTest = undefined;
    const fourthTest = false;
    expect(classNames('test', secondTest, thirdTest, fourthTest)).toBe('test');
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

});
