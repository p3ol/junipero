import React from 'react';
import { mount } from 'enzyme';

import Card from './';

describe('<Card />', () => {
  it('should render Card component and it child', () => {
    const component = mount(<Card><div className="test" /></Card>);
    expect(component.find('.junipero.card').length).toBe(1);
    expect(component.find('.test').length).toBe(1);
  });
});
