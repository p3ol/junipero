import React, { createRef } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import ColorField from './';

describe('<ColorField />', () => {

  it('should render', () => {
    const component = mount(<ColorField />);
    component.find('input').simulate('focus');
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

  it('should fire onFocus/onBlur events', () => {
    const onFocus = sinon.spy();
    const onBlur = sinon.spy();
    const component = mount(<ColorField onFocus={onFocus} onBlur={onBlur} />);
    component.find('input').simulate('focus');
    expect(onFocus.called).toBe(true);
    component.find('input').simulate('blur');
    expect(onBlur.called).toBe(true);
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

  it('should update values when mouse is down and lightness handle is ' +
    'selected', () => {
    const ref = createRef();
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };
    const component = mount(
      <ColorField opened={true} ref={ref} globalEventsTarget={document} />
    );
    component.find('.lightness').simulate('mousedown', { button: 0 });
    expect(ref.current.handleMoving).toBe(true);
    expect(ref.current.handleType).toBe('lightness');
    window.pageXOffset = 50;
    window.pageYOffset = 50;

    // Simulate element width/height
    Object.defineProperty(
      ref.current.colorLightnessRef.current,
      'offsetWidth',
      { value: 100 }
    );
    Object.defineProperty(
      ref.current.colorLightnessRef.current,
      'offsetHeight',
      { value: 100 }
    );

    act(() => { map.mousemove({ pageX: 100, pageY: 100 }); });
    expect(ref.current.s).toBe(50);
    expect(ref.current.v).toBe(50);
  });

  it('should update values when mouse is down and hue handle is ' +
    'selected', () => {
    const ref = createRef();
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };
    const component = mount(
      <ColorField opened={true} ref={ref} globalEventsTarget={document} />
    );
    component.find('.hue').simulate('mousedown', { button: 0 });
    expect(ref.current.handleMoving).toBe(true);
    expect(ref.current.handleType).toBe('hue');
    window.pageXOffset = 50;
    Object.defineProperty(
      ref.current.colorHueRef.current,
      'offsetWidth',
      { value: 100 }
    );
    act(() => { map.mousemove({ pageX: 100 }); });
    expect(ref.current.h).toBe(180);
  });

  it('should update values when mouse is down and alpha handle is ' +
    'selected', () => {
    const ref = createRef();
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };
    const component = mount(
      <ColorField opened={true} ref={ref} globalEventsTarget={document} />
    );
    component.find('.alpha').simulate('mousedown', { button: 0 });
    expect(ref.current.handleMoving).toBe(true);
    expect(ref.current.handleType).toBe('alpha');
    window.pageXOffset = 50;
    Object.defineProperty(
      ref.current.colorAlphaRef.current,
      'offsetWidth',
      { value: 100 }
    );
    act(() => { map.mousemove({ pageX: 100 }); });
    expect(ref.current.a).toBe(50);
  });

  it('should close color menu and trigger onBlur event if clicked ' +
    'outside', () => {
    const ref = createRef();
    const onBlur = sinon.spy();
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };
    const component = mount(
      <ColorField onBlur={onBlur} globalEventsTarget={document} ref={ref} />
    );
    act(() => { ref.current.focus(); });
    expect(ref.current.opened).toBe(true);
    act(() => {
      map.click({ target: document.body });
      ref.current.blur();
      component.find('input').simulate('blur');
    });
    expect(ref.current.opened).toBe(false);
    expect(onBlur.called).toBe(true);
  });

  it('should not close color menu if input is clicked', () => {
    const ref = createRef();
    const component = mount(<ColorField ref={ref} />);
    act(() => { ref.current.focus(); });
    expect(ref.current.opened).toBe(true);
    component.find('.junipero.dropdown-toggle').simulate('click');
    expect(ref.current.opened).toBe(true);
  });

  it('should set color cursors as moving on mouse down event', () => {
    const ref = createRef();
    const component = mount(<ColorField ref={ref} />);
    act(() => { ref.current.focus(); });
    component.update();
    component.find('.lightness').simulate('mousedown', { button: 0 });
    expect(ref.current.handleMoving).toBe(true);
    expect(ref.current.handleType).toBe('lightness');
  });

  it('should not move color cursors as moving if clicked button is not 0 ' +
    '(left click)', () => {
    const ref = createRef();
    const component = mount(<ColorField ref={ref} />);
    act(() => { ref.current.focus(); });
    component.update();
    component.find('.lightness').simulate('mousedown', { button: 1 });
    expect(ref.current.handleMoving).toBe(false);
    expect(ref.current.handleType).toBeNull();
  });

  it('should set color cursors as not moving on mouse up event', () => {
    const ref = createRef();
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    const component = mount(
      <ColorField ref={ref} globalEventsTarget={document} />
    );
    act(() => { ref.current.focus(); });
    component.update();
    component.find('.lightness').simulate('mousedown', { button: 0 });
    expect(ref.current.handleMoving).toBe(true);
    expect(ref.current.handleType).toBe('lightness');
    act(() => { map.mouseup(); });
    expect(ref.current.handleMoving).toBe(false);
  });

  it('should fire onToggle event when opened/closed', () => {
    const ref = createRef();
    const onToggle = sinon.spy();
    mount(<ColorField ref={ref} onToggle={onToggle} />);
    act(() => { ref.current.dropdownRef.current.open(); });
    expect(ref.current.opened).toBe(true);
    expect(onToggle.calledWith(sinon.match({ opened: true }))).toBe(true);
    act(() => { ref.current.dropdownRef.current.close(); });
    expect(ref.current.opened).toBe(false);
    expect(onToggle.calledWith(sinon.match({ opened: false }))).toBe(true);
  });

  it('should allow to reset input to its original value', () => {
    const ref = createRef();
    const component = mount(<ColorField ref={ref} value="#000" />);
    expect(ref.current.internalValue).toBe('#000');
    expect(ref.current.h).toBe(0);
    expect(ref.current.s).toBe(0);
    expect(ref.current.v).toBe(100);
    expect(ref.current.a).toBe(100);
    component.find('input').simulate('change', { target: { value: '#F00' } });
    expect(ref.current.internalValue).toBe('#F00');
    expect(ref.current.h).toBe(0);
    expect(ref.current.s).toBe(100);
    expect(ref.current.v).toBe(0);
    expect(ref.current.a).toBe(100);
    act(() => { ref.current.reset(); });
    expect(ref.current.internalValue).toBe('#000');
    expect(ref.current.h).toBe(0);
    expect(ref.current.s).toBe(0);
    expect(ref.current.v).toBe(100);
    expect(ref.current.a).toBe(100);
  });

});
