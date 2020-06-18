import React, { createRef } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import SliderField from './';

describe('<SliderField />', () => {
  it('should render', () => {
    const ref = createRef();
    const component = mount(<SliderField ref={ref} />);
    component.find('.handle').simulate('focus');
    act(() => { ref.current.reset(); });
    component.find('.handle').simulate('blur');
    expect(component.find('.junipero.slider').length).toBe(1);
  });

  it('should initialize if value prop is defined on mount', () => {
    const ref = createRef();
    mount(<SliderField ref={ref} value={10} />);
    expect(ref.current.internalValue).toBe(10);
  });
});
