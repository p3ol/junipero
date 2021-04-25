import React, { createRef } from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import Dropdown from './';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownItem from '../DropdownItem';

describe('<Dropdown />', () => {

  it('should render', () => {
    const component = shallow(<Dropdown />);
    expect(component.find('.junipero.dropdown').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(<Dropdown ref={ref} />);
    expect(ref.current.innerRef.current).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
    expect(ref.current.toggleRef).toBeDefined();
    expect(ref.current.menuRef).toBeDefined();
    expect(ref.current.opened).toBe(false);
    expect(ref.current.toggle).toBeDefined();
    expect(ref.current.open).toBeDefined();
    expect(ref.current.close).toBeDefined();
    expect(ref.current.update).toBeDefined();
    expect(ref.current.forceUpdate).toBeDefined();
  });

  it('should render a full dropdown with toggle, menu & items', () => {
    const ref = createRef();
    const component = mount(
      <Dropdown ref={ref}>
        <DropdownToggle>Open me</DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Menu item</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    expect(component.find('.junipero.dropdown-toggle').length).toBe(1);
    component.find('.junipero.dropdown-toggle').simulate('click');
    expect(ref.current.opened).toBe(true);
    expect(component.find('.junipero.dropdown-menu').length).toBe(1);
    expect(component.find('.junipero.dropdown-item').length).toBe(1);
  });

  it('should auto close menu when disabled prop changes', () => {
    const ref = createRef();
    const component = mount(<Dropdown ref={ref} opened={true} />);
    expect(ref.current.opened).toBe(true);
    component.setProps({ disabled: true });
    expect(ref.current.opened).toBe(false);
  });

  it('should auto close menu when clicking outside', () => {
    const ref = createRef();
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    mount(
      <Dropdown ref={ref} opened={true} globalEventsTarget={document}>
        <DropdownMenu />
      </Dropdown>
    );
    expect(ref.current.opened).toBe(true);
    act(() => { map.click({ target: document.body }); });
    expect(ref.current.opened).toBe(false);
  });

  it('should close menu even when it doesn\'t exist', () => {
    const ref = createRef();
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    mount(<Dropdown ref={ref} opened={true} globalEventsTarget={document} />);
    act(() => { map.click({ target: document.body }); });
    expect(ref.current.opened).toBe(false);
  });

  it('should not try to close menu when clicked inside', () => {
    const ref = createRef();
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    mount(
      <Dropdown ref={ref} opened={true} globalEventsTarget={document}>
        <DropdownMenu />
      </Dropdown>
    );
    act(() => { map.click({ target: ref.current.menuRef.current }); });
    expect(ref.current.opened).toBe(true);
  });

  it('should not allow to open menu when disabled', () => {
    const ref = createRef();
    mount(<Dropdown ref={ref} disabled={true} />);
    act(() => { ref.current.open(); });
    expect(ref.current.opened).toBe(false);
  });

  it('should toggle dropdown opened state when using toggle ' +
    'method', () => {
    const ref = createRef();
    mount(<Dropdown ref={ref} />);
    act(() => { ref.current.toggle(); });
    expect(ref.current.opened).toBe(true);
    act(() => { ref.current.toggle(); });
    expect(ref.current.opened).toBe(false);
  });

  it('should toggle dropdown opened state when using open/close ' +
    'methods', () => {
    const ref = createRef();
    mount(<Dropdown ref={ref} />);
    act(() => { ref.current.open(); });
    expect(ref.current.opened).toBe(true);
    act(() => { ref.current.close(); });
    expect(ref.current.opened).toBe(false);
  });

  it('should allow to retrieve toggle & menu inner refs', () => {
    const ref = createRef();
    const toggleRef = createRef();
    const menuRef = createRef();
    const component = mount(
      <Dropdown opened={true} ref={ref}>
        <DropdownToggle ref={toggleRef}>Open me</DropdownToggle>
        <DropdownMenu ref={menuRef}>
          <DropdownItem>Menu item</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    expect(toggleRef.current.innerRef.current)
      .toBe(component.find('.junipero.dropdown-toggle').getDOMNode());
    expect(menuRef.current.innerRef.current)
      .toBe(component.find('.junipero.dropdown-menu').getDOMNode());
  });

  it('should allow to retrieve toggle & menu inner refs as functions', () => {
    const ref = createRef();
    const toggleRef = createRef();
    const menuRef = createRef();
    const component = mount(
      <Dropdown opened={true} ref={ref}>
        <DropdownToggle ref={ref => { toggleRef.current = ref; }}>
          Open me
        </DropdownToggle>
        <DropdownMenu ref={ref => { menuRef.current = ref; }}>
          <DropdownItem>Menu item</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
    expect(toggleRef.current.innerRef.current)
      .toBe(component.find('.junipero.dropdown-toggle').getDOMNode());
    expect(menuRef.current.innerRef.current)
      .toBe(component.find('.junipero.dropdown-menu').getDOMNode());
  });

  it('should also render arbitrary children', () => {
    const ref = createRef();
    const component = mount(
      <Dropdown opened={true} ref={ref}>
        <span className="test" />
      </Dropdown>
    );
    expect(component.find('span.test').length).toBe(1);
  });

  it('should allow to define a custom target to check for a click outside ' +
    'event', async () => {
    const ref = createRef();
    const buttonRef = createRef();
    const linkRef = createRef();

    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    mount(<a ref={linkRef} className="link" />);

    const component = mount(
      <div>
        <button className="button" ref={buttonRef} />
        <Dropdown
          globalEventsTarget={document}
          ref={ref}
          clickOutsideTarget={linkRef.current}
        >
          <DropdownToggle>
            Open me
          </DropdownToggle>
          <DropdownMenu />
        </Dropdown>
      </div>
    );

    component.find('.junipero.dropdown-toggle').simulate('click');
    expect(ref.current.opened).toBe(true);
    expect(component.find('.junipero.dropdown-menu').length).toBe(1);
    expect(linkRef.current).toBeDefined();
    act(() => { map.click({ target: linkRef.current }); });
    expect(ref.current.opened).toBe(true);
    expect(component.find('.junipero.dropdown-menu').length).toBe(1);
    act(() => { map.click({ target: buttonRef.current }); });
    expect(ref.current.opened).toBe(false);
  });

  it('should not trigger onToggle event when clicking outside toggle and ' +
    'menu is not opened', async () => {
    const ref = createRef();
    const onToggle = sinon.spy();

    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    const component = mount(
      <Dropdown
        globalEventsTarget={document}
        onToggle={onToggle}
        ref={ref}
      >
        <DropdownToggle>
          Open me
        </DropdownToggle>
        <DropdownMenu />
      </Dropdown>
    );

    act(() => { map.click({ target: document.body }); });
    expect(ref.current.opened).toBe(false);
    expect(component.find('.junipero.dropdown-menu').length).toBe(0);
    expect(onToggle.called).toBe(false);
  });

});
