import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import CodeField from '../src/CodeField';

describe('<CodeField />', () => {

  it('should render', () => {
    const component = shallow(<CodeField />);
    expect(component.find('.junipero-code-field').length).toBe(1);
  });

  it('should have a default onChange handler', () => {
    expect(CodeField.defaultProps.onChange).toBeDefined();
    expect(CodeField.defaultProps.onChange()).not.toBeDefined();
  });

  it('should fire onChange event handler when updated', () => {
    const onChange = sinon.spy();
    const component = shallow(<CodeField onChange={onChange} />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '0' } });

    expect(onChange.calledWith(sinon.match.has('value', '0'))).toBe(true);
    expect(onChange.calledWith(sinon.match.has('valid', false))).toBe(true);
  });

  it('should validate value with default predicate', () => {
    expect(CodeField.defaultProps.validate).toBeDefined();
    expect(CodeField.defaultProps.validate('test')).toBe(true);
    expect(CodeField.defaultProps.validate()).toBe(false);
  });

});
