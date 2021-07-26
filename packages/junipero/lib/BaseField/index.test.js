import React, { createRef } from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import BaseField from './';

describe('<BaseField />', () => {

  it('should render', () => {
    const component = shallow(<BaseField />);
    expect(component.find('.junipero.base').length).toBe(1);
    component.find('.base').simulate('focus');
    component.find('.base').simulate('blur');
  });

  it('should provide access to inner ref', () => {
    const ref = createRef();
    const component = mount(<BaseField ref={ref} />);
    expect(component.find('.junipero.base').getDOMNode())
      .toBe(ref.current.innerRef.current);
  });

  it('should render with a placeholder or a label', () => {
    const component = mount(
      <BaseField placeholder="Placeholder" label="Label" />
    );
    expect(component.find('.placeholder').length).toBe(1);
    expect(component.find('.label').length).toBe(1);
    component.setProps({ value: 'a', empty: false });
    expect(component.find('.placeholder').length).toBe(0);
  });

  it('should fire focus and blur handlers', () => {
    const onFocus = sinon.spy();
    const onBlur = sinon.spy();
    const component = mount(
      <BaseField onFocus={onFocus} onBlur={onBlur} />
    );
    component.find('.base').simulate('focus');
    expect(onFocus.called).toBe(true);
    component.find('.base').simulate('blur');
    expect(onBlur.called).toBe(true);
  });

});
