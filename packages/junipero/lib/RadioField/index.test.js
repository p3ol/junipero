import React, { createRef } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import RadioField from './';

describe('<RadioField />', () => {

  it('should render', () => {
    const component = mount(
      <RadioField label="Test" />
    );
    expect(component.find('.junipero.radio').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(<RadioField ref={ref} label="Test" />);
    expect(ref.current.innerRef.current).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
  });

  it('should correctly fire onChange event', () => {
    const onChange = sinon.spy();
    const component = mount(<RadioField checked={true} onChange={onChange} />);
    component.find('input').simulate('change', { target: { checked: true } });
    expect(onChange.withArgs(sinon.match({ checked: true })).called)
      .toBe(true);
  });

});
