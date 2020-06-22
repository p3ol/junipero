import React, { createRef } from 'react';
import { mount } from 'enzyme';

import Tab from './';

describe('<Tabs />', () => {

  it('should render', () => {
    const component = mount(
      <Tab />
    );
    expect(component.find('.junipero.tab').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(
      <Tab ref={ref} />
    );
    expect(ref.current.innerRef).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
  });

});
