import React from 'react';
import { shallow } from 'enzyme';

import Tab from '../src/Tab';

describe('<Tab />', () => {

  it('should render', () => {
    const component = shallow(<Tab />);
    expect(component.find('.junipero-tab').length).toBe(1);
  });

});
