import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import Dropdown from '../src/Dropdown';
import DropdownMenu from '../src/DropdownMenu';

describe('<Dropdown />', () => {

  it('should render', () => {
    const component = shallow(<Dropdown />);
    expect(component.find('.junipero-dropdown').length).toBe(1);
  });

  it('should have default handlers defined', () => {
    expect(Dropdown.defaultProps.onToggle).toBeDefined();
    expect(Dropdown.defaultProps.onToggle()).not.toBeDefined();
  });

  it('should auto close menu when disabled prop changes', () => {
    const component = shallow(<Dropdown isOpen={true} />);
    expect(component.state('opened')).toBe(true);
    component.setProps({ disabled: true });
    expect(component.state('opened')).toBe(false);
  });

  it('should auto close menu when clicking outside', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    const component = mount(
      <Dropdown isOpen={true}>
        <DropdownMenu />
      </Dropdown>
    );
    expect(component.state('opened')).toBe(true);
    map.click({ target: document.body });
    expect(component.state('opened')).toBe(false);
  });

  it('should not try to close menu when it doesn\'t exist', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    const component = mount(<Dropdown isOpen={true} />);
    map.click({ target: document.body });
    expect(component.state('opened')).toBe(true);
  });

  it('should not try to close menu when clicked inside', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    const component = mount(
      <Dropdown isOpen={true}>
        <DropdownMenu />
      </Dropdown>
    );
    map.click({ target: component.instance().menuRef.innerRef });
    expect(component.state('opened')).toBe(true);
  });

  it('should not allow to open menu when disabled', () => {
    const component = shallow(<Dropdown disabled={true} />);
    component.instance().open();
    expect(component.state('opened')).toBe(false);
  });

  it('should toggle dropdown opened state when using toggle method', () => {
    const component = shallow(<Dropdown />);
    component.instance().toggle();
    expect(component.state('opened')).toBe(true);
    component.instance().toggle();
    expect(component.state('opened')).toBe(false);
  });

});
