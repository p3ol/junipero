import React from 'react';
import { shallow } from 'enzyme';

import Button from './';

describe('<Button />', () => {

  it('should render', () => {
    const component = shallow(<Button>Click me</Button>);
    expect(component.find('.junipero.button').length).toBe(1);
  });

});
