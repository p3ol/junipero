import React, { createRef } from 'react';
import { shallow, mount } from 'enzyme';

import BreadCrumb from './';

describe('<BreadCrumb />', () => {

  it('should render', () => {
    const component = shallow(<BreadCrumb />);
    expect(component.find('.junipero.breadcrumb').length).toBe(1);
  });

  it('should render a list of breadcrumb items', () => {
    const component = shallow(<BreadCrumb items={['test', 'secondTest']} />);
    const nodes = [
      <span className="item" key={0}>test</span>,
      <span className="item" key={1}>secondTest</span>,
    ];
    expect(component.contains(nodes)).toBe(true);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(
      <BreadCrumb ref={ref} items={['test', 'secondTest']} />);
    expect(ref.current.innerRef).toBeDefined();
    expect(component.getDOMNode()).toMatchObject(ref.current.innerRef.current);
  });

});
