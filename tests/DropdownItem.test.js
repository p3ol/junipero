import React from 'react';
import { shallow } from 'enzyme';

import DropdownItem from '../src/DropdownItem';

describe('<DropdownItem />', () => {

  it('should render', () => {
    const component = shallow(<DropdownItem />);
    expect(component.find('.junipero-dropdown-item').length).toBe(1);
  });

});
