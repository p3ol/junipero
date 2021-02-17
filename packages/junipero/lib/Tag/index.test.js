import React from 'react';
import { mount } from 'enzyme';

import Tag from './';

describe('<Tag />', () => {
  it('should render tag component', () => {
    const component = mount(<Tag />);
    expect(component.find('.junipero.tag').length).toBe(1);
  });
});
