import React, { createRef } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Tabs from './';
import Tab from '../Tab';

describe('<Tabs />', () => {

  it('should render', () => {
    const component = mount(
      <Tabs />
    );
    expect(component.find('.junipero.tabs').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(
      <Tabs ref={ref}>
        <Tab title="One">One</Tab>
      </Tabs>
    );
    expect(ref.current.innerRef).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
  });

  it('should fire onChange event when changing tab', () => {
    const onChange = sinon.spy();
    const component = mount(
      <Tabs onChange={onChange}>
        <Tab>One</Tab>
        <Tab>Two</Tab>
      </Tabs>
    );
    component.find('li.title').at(1).find('a').simulate('click');
    expect(onChange.calledWith(1)).toBe(true);
  });

  it('should change internal active tab when changing prop', () => {
    const ref = createRef();
    const component = mount(<Tabs ref={ref}><Tab>test</Tab></Tabs>);
    component.setProps({ active: 1 });
    expect(ref.current.activeTab).toBe(1);
  });

  it('should change active tab when clicking on another tab title', () => {
    const ref = createRef();
    const component = mount(
      <Tabs ref={ref}>
        <Tab>tab1</Tab>
        <Tab>tab2</Tab>
      </Tabs>
    );
    component.find('li.title').at(1).find('a').simulate('click');
    expect(ref.current.activeTab).toBe(1);
  });

  it('shouldn\'t change active tab if tab is disabled', () => {
    const ref = createRef();
    const component = mount(
      <Tabs ref={ref}>
        <Tab>tab1</Tab>
        <Tab disabled={true}>tab2</Tab>
      </Tabs>
    );
    component.find('li.title').at(1).find('a').simulate('click');
    expect(ref.current.activeTab).toBe(0);
  });

});
