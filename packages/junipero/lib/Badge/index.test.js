import React from 'react';
import { mount } from 'enzyme';

import Badge from './';

describe('<Badge />', () => {

  it('should render a basic badge', () => {
    const component = mount(<Badge value="1"/>);
    expect(component.find('.junipero.badge').length).toBe(1);
  });
});
