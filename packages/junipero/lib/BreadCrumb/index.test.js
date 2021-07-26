import React from 'react';
import { shallow, mount } from 'enzyme';

import BreadCrumb from './';
import BreadCrumbItem from '../BreadCrumbItem';

describe('<BreadCrumb />', () => {

  it('should render', () => {
    const component = shallow(<BreadCrumb />);
    expect(component.find('.junipero.breadcrumb').length).toBe(1);
  });

  it('should render a list of breadcrumb items', () => {
    const component = mount(
      <BreadCrumb>
        <BreadCrumbItem>test</BreadCrumbItem>
        <BreadCrumbItem>secondTest</BreadCrumbItem>
      </BreadCrumb>
    );

    const nodes = [
      <span className="junipero breadcrumb-item" key={0}>test</span>,
      <span className="junipero breadcrumb-item" key={1}>secondTest</span>,
    ];

    expect(component.contains(nodes[0])).toBe(true);
    expect(component.contains(nodes[1])).toBe(true);
  });

  it('should render a list of breadcrumb items using items prop', () => {
    const component = shallow(<BreadCrumb items={['test', 'secondTest']} />);
    const nodes = [
      <span className="item" key={0}>test</span>,
      <span className="item" key={1}>secondTest</span>,
    ];
    expect(component.contains(nodes)).toBe(true);
  });

});
