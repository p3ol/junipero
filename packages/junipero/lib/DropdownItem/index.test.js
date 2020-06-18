import React, { createRef } from 'react';
import { shallow, mount } from 'enzyme';

import DropdownItem from './';

describe('<DropdownItem />', () => {

  it('should render', () => {
    const component = shallow(<DropdownItem />);
    expect(component.find('.junipero.dropdown-item').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(<DropdownItem ref={ref} />);
    expect(ref.current.innerRef.current).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
  });

});
