import React from 'react';
import { mount } from 'enzyme';

import TouchableZone from './';

describe('<TouchableZone />', () => {
  it('should render TouchableZone component and its childs', () => {
    const component = mount(
      <TouchableZone><span className="test">Test</span></TouchableZone>
    );
    expect(component.find('.junipero.touchable-zone').length).toBe(1);
    expect(component.find('.test').length).toBe(1);
  });
});
