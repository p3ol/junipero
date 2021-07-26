import React from 'react';
import { mount } from 'enzyme';

import Tab from './';

describe('<Tab />', () => {

  it('should render', () => {
    const component = mount(
      <Tab />
    );
    expect(component.find('.junipero.tab').length).toBe(1);
  });

});
