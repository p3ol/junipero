import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { DropdownContext } from '../contexts';
import DropdownToggle from './';

describe('<DropdownToggle />', () => {

  it('should render', () => {
    const component = mount(
      <DropdownContext.Provider
        value={{ disabled: false, toggle: () => {} }}
      >
        <DropdownToggle>Open me</DropdownToggle>
      </DropdownContext.Provider>
    );
    expect(component.find('.junipero.dropdown-toggle').length).toBe(1);
  });

  it('should trigger dropdown toggle on click', () => {
    const toggle = sinon.spy();
    const component = mount(
      <DropdownContext.Provider
        value={{ disabled: false, toggle }}
      >
        <DropdownToggle>Open me</DropdownToggle>
      </DropdownContext.Provider>
    );
    component.find('.junipero.dropdown-toggle').simulate('click');
    expect(toggle.called).toBe(true);
  });

  it('should not trigger dropdown toggle on click if dropdown is ' +
    'disabled', () => {
    const toggle = sinon.spy();
    const component = mount(
      <DropdownContext.Provider
        value={{ disabled: true, toggle }}
      >
        <DropdownToggle>Open me</DropdownToggle>
      </DropdownContext.Provider>
    );
    component.find('.junipero.dropdown-toggle').simulate('click');
    expect(toggle.called).toBe(false);
  });

});
