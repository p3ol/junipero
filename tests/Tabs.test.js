import React from 'react';
import { shallow, mount } from 'enzyme';

import Tabs from '../src/Tabs';
import Tab from '../src/Tab';

describe('<Tabs />', () => {

  it('should render', () => {
    const component = mount(<Tabs><Tab>test</Tab></Tabs>);
    expect(component.find('.junipero-tabs').length).toBe(1);
    expect(component.find('.junipero-tab').length).toBe(1);
  });

  it('should change internal active tab when changing prop', () => {
    const component = shallow(<Tabs><Tab>test</Tab></Tabs>);
    component.setProps({ activeTab: 1 });
    expect(component.state('activeTab')).toBe(1);
  });

  it('should change active tab when clicking on another tab title', () => {
    const component = shallow(
      <Tabs>
        <Tab>tab1</Tab>
        <Tab>tab2</Tab>
      </Tabs>
    );
    component.find('li.tab-title').at(1).find('a').simulate('click');
    expect(component.state('activeTab')).toBe(1);
  });

  it('shouldn\'t change active tab if tab is disabled', () => {
    const component = shallow(
      <Tabs>
        <Tab>tab1</Tab>
        <Tab disabled={true}>tab2</Tab>
      </Tabs>
    );
    component.find('li.tab-title').at(1).find('a').simulate('click');
    expect(component.state('activeTab')).toBe(0);
  });

});
