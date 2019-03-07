import React from 'react';
import { shallow } from 'enzyme';

import BreadCrumb from '../src/BreadCrumb';

describe('<BreadCrumb />', () => {

  it('should render', () => {
    const component = shallow(<BreadCrumb />);
    expect(component.find('.junipero-bread-crumb').length).toBe(1);
  });

  it('should render a list of breadcrumb items', () => {
    const component = shallow(<BreadCrumb items={['test', 'secondTest']} />);
    const nodes = [<span>test</span>, <span>secondTest</span>];
    expect(component.contains(nodes)).toBe(true);
  });

});
