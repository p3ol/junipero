import React, { createRef } from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import ColorField from './';

describe('<ColorField />', () => {

  it('should render', () => {
    const component = shallow(<ColorField />);
    expect(component.find('.junipero.color-input').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(<ColorField ref={ref} />);
    expect(ref.current.innerRef).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
    expect(ref.current.inputRef).toBeDefined();
    expect(ref.current.colorWheelRef).toBeDefined();
    expect(ref.current.colorLightnessRef).toBeDefined();
    expect(ref.current.colorHueRef).toBeDefined();
    expect(ref.current.colorAlphaRef).toBeDefined();
    expect(ref.current.opened).toBe(false);
    expect(ref.current.reset).toBeDefined();
    expect(ref.current.focus).toBeDefined();
    expect(ref.current.blur).toBeDefined();
    expect(ref.current.h).toBe(0);
    expect(ref.current.s).toBe(0);
    expect(ref.current.v).toBe(0);
    expect(ref.current.a).toBe(100);
    expect(ref.current.valid).toBe(false);
  });

  it('should update internal value if value prop changes', () => {
    const ref = createRef();
    const component = mount(<ColorField ref={ref} value="#FFF" />);
    component.setProps({ value: '#000' });
    expect(ref.current.internalValue).toBe('#000');
  });

  it('should register document events to track mouse click & position', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };
    mount(<ColorField globalEventsTarget={document} />);
    expect(map.mousemove).toBeDefined();
    expect(map.mouseup).toBeDefined();
  });

  it('should remove document events on unmount', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };
    document.removeEventListener = (event, cb) => delete map[event];

    const component = mount(<ColorField globalEventsTarget={document} />);
    expect(map.mousemove).toBeDefined();
    expect(map.mouseup).toBeDefined();

    component.unmount();
    expect(map.mousemove).not.toBeDefined();
    expect(map.mouseup).not.toBeDefined();
  });

  it('should close color menu and trigger onBlur event if clicked ' +
    'outside', () => {
    const ref = createRef();
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };
    mount(<ColorField globalEventsTarget={document} ref={ref} />);
    act(() => { ref.current.focus(); });
    expect(ref.current.opened).toBe(true);
    act(() => { map.click({ target: document.body }); });
    expect(ref.current.opened).toBe(false);
  });

  //
  // it('should not close color menu if input is clicked', () => {
  //   const component = mount(<ColorField />);
  //   component.instance().open();
  //   component.instance().onClickOutside({ target: component.instance().input });
  //   expect(component.state('opened')).toBe(true);
  // });
  //
  // it('should set color cursors as moving on mouse down event', () => {
  //   const component = mount(<ColorField />);
  //   component.find('.lightness').simulate('mousedown', { button: 0 });
  //   expect(component.state('handleMoving')).toBe(true);
  //   expect(component.state('handleType')).toBe('lightness');
  // });
  //
  // it('should not move color cursors as moving if clicked button is not 0 ' +
  //   '(left click)', () => {
  //   const component = mount(<ColorField />);
  //   component.find('.lightness').simulate('mousedown', { button: 1 });
  //   expect(component.state('handleMoving')).toBe(false);
  //   expect(component.state('handleType')).toBe(null);
  // });
  //
  // it('should set color cursors as not moving on mouse up event', () => {
  //   const map = {};
  //   document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };
  //
  //   const component = mount(<ColorField />);
  //   component.find('.lightness').simulate('mousedown', { button: 0 });
  //   expect(component.state('handleMoving')).toBe(true);
  //   expect(component.state('handleType')).toBe('lightness');
  //   map.mouseup();
  //   expect(component.state('handleMoving')).toBe(false);
  // });
  //
  // it('should close color menu when using component close method', () => {
  //   const component = mount(<ColorField />);
  //   component.instance().open();
  //   expect(component.state('opened')).toBe(true);
  //   component.instance().close();
  //   expect(component.state('opened')).toBe(false);
  // });
  //
  // it('should fire onToggle event when opened/closed', () => {
  //   const onToggle = sinon.spy();
  //   const component = mount(<ColorField onToggle={onToggle} />);
  //
  //   component.instance().open();
  //   expect(component.state('opened')).toBe(true);
  //   expect(onToggle.calledWith(true)).toBe(true);
  //   component.instance().close();
  //   expect(component.state('opened')).toBe(false);
  //   expect(onToggle.calledWith(false)).toBe(true);
  // });

});
