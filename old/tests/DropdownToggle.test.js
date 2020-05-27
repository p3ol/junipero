import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import Dropdown from '../src/Dropdown';
import DropdownToggle from '../src/DropdownToggle';

describe('<DropdownToggle />', () => {

  it('should render', () => {
    const component = mount(<Dropdown><DropdownToggle /></Dropdown>);
    expect(component.find('.junipero-dropdown-toggle').length).toBe(1);
  });

  it('should not trigger onclick event if parent dropdown is disabled', () => {
    const onClick = sinon.spy();
    const component = mount(
      <Dropdown disabled={true}><DropdownToggle onClick={onClick} /></Dropdown>
    );
    component.find('.junipero-dropdown-toggle').simulate('click');
    expect(onClick.called).toBe(false);
  });

});
