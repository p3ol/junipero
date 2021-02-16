import React from 'react';
import { mount } from 'enzyme';

import Badge from './';

describe('<Badge />', () => {

  it('should all different badges', () => {
    const component = mount(<Badge />);
    expect(component.find('.junipero.badge').length).toBe(1);
  });
});
