import React from 'react';
import { mount } from 'enzyme';

import { DropdownContext } from '../contexts';
import DropdownMenu from './';

describe('<DropdownMenu />', () => {

  it('should render', () => {
    const component = mount(
      <DropdownContext.Provider
        value={{ styles: {}, attributes: {}, opened: true }}
      >
        <DropdownMenu />
      </DropdownContext.Provider>
    );
    expect(component.find('.junipero.dropdown-menu').length).toBe(1);
  });

  it('should allow to render menu inside a custom container', () => {
    mount(
      <DropdownContext.Provider
        value={{ styles: {}, attributes: {}, opened: true }}
      >
        <DropdownMenu container="body" />
      </DropdownContext.Provider>
    );
    expect(document.body.querySelector('.junipero.junipero-menu'))
      .toBeDefined();
  });

  it('should allow to animate menu', () => {
    const component = mount(
      <DropdownContext.Provider
        value={{ styles: {}, attributes: {}, opened: true }}
      >
        <DropdownMenu
          animate={menu => (
            <div className="animation">
              { menu }
            </div>
          )}
        />
      </DropdownContext.Provider>
    );
    expect(component.find('.animation').length).toBe(1);
  });

  it('should allow the use of insert apparition mode', () => {
    const component = mount(
      <DropdownContext.Provider
        value={{ opened: false }}
      >
        <DropdownMenu apparition="insert" />
      </DropdownContext.Provider>
    );
    expect(component.find('.menu-inner').length).toBe(0);
    component.setProps({ value: { opened: true } });
    expect(component.find('.menu-inner').length).toBe(1);
  });

  it('should allow the use of css apparition mode', () => {
    const component = mount(
      <DropdownContext.Provider
        value={{ opened: false }}
      >
        <DropdownMenu apparition="css" />
      </DropdownContext.Provider>
    );
    expect(component.find('.menu-inner').length).toBe(1);
    component.setProps({ value: { opened: true } });
    expect(component.find('.menu-inner').length).toBe(1);
  });

});
