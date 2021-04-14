import React, { createRef } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';

import SliderField from './';

describe('<SliderField />', () => {
  it('should render', () => {
    const ref = createRef();
    const component = mount(<SliderField ref={ref} />);
    component.find('.handle').simulate('focus');
    act(() => { ref.current.reset(); });
    component.find('.handle').simulate('blur');
    expect(component.find('.junipero.slider').length).toBe(1);
  });

  it('should initialize if value prop is defined on mount', () => {
    const ref = createRef();
    mount(<SliderField ref={ref} value={10} />);
    expect(ref.current.internalValue).toBe(10);
  });

  it('should update precision when changing step', () => {
    const ref = createRef();
    const component = mount(<SliderField ref={ref} />);
    expect(ref.current.precision).toBe(0);
    component.setProps({ step: 0.1 });
    expect(ref.current.precision).toBe(1);
  });

  it('should update internal value when value prop changes', () => {
    const ref = createRef();
    const component = mount(<SliderField ref={ref} />);
    expect(ref.current.internalValue).toBe(0);
    component.setProps({ value: 10 });
    expect(ref.current.internalValue).toBe(10);
  });

  it('should return a value rounded to the correct step & precision', () => {
    const ref = createRef();
    const component = mount(
      <SliderField
        ref={ref}
        min={0}
        max={100}
        step={1}
      />
    );
    component.setProps({ value: 15.6 });
    expect(ref.current.internalValue).toBe(16);

    component.setProps({ value: -5 });
    expect(ref.current.internalValue).toBe(0);

    component.setProps({ value: 255.155435 });
    expect(ref.current.internalValue).toBe(100);

    component.setProps({ step: 0.1, value: 15.6 });
    expect(ref.current.internalValue).toBe(15.6);

    component.setProps({ value: 15.68 });
    expect(ref.current.internalValue).toBe(15.7);

    component.setProps({ value: -5.546 });
    expect(ref.current.internalValue).toBe(0);

    component.setProps({ value: 255.155435 });
    expect(ref.current.internalValue).toBe(100);

    component.setProps({ max: 1000, step: 10, value: 156 });
    expect(ref.current.internalValue).toBe(160);

    component.setProps({ value: -5.546 });
    expect(ref.current.internalValue).toBe(0);

    component.setProps({ value: 255.155435 });
    expect(ref.current.internalValue).toBe(260);
  });

  it('should register document events to track mouse click & position', () => {
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    mount(<SliderField globalEventsTarget={document} />);
    expect(map.mousemove).toBeDefined();
    expect(map.mouseup).toBeDefined();
  });

  it('should remove document events on unmount', () => {
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    document.removeEventListener = event => delete map[event];

    const component = mount(<SliderField globalEventsTarget={document} />);
    expect(map.mousemove).toBeDefined();
    expect(map.mouseup).toBeDefined();

    component.unmount();
    expect(map.mousemove).toBeUndefined();
    expect(map.mouseup).toBeUndefined();
  });

  it('should set slider as moving on mouse down', () => {
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    const ref = createRef();
    const component = mount(
      <SliderField globalEventsTarget={document} ref={ref} />
    );
    component.find('.handle').simulate('mousedown', { button: 0 });
    expect(ref.current.moving).toBe(true);

    act(() => { map.mouseup(); });
    expect(ref.current.moving).toBe(false);

    component.find('.handle').simulate('mousedown', { button: 1 });
    expect(ref.current.moving).toBe(false);

    act(() => { map.mouseup(); });
    expect(ref.current.moving).toBe(false);
  });

  it('should trigger onChange event on mouse move', () => {
    const ref = createRef();
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    const onChange = sinon.spy();
    const component = mount(
      <SliderField
        ref={ref}
        globalEventsTarget={document}
        onChange={onChange}
        min={0}
        max={100}
        step={1}
      />
    );
    Object.defineProperty(
      ref.current.slideRef.current,
      'offsetWidth',
      { value: 234 }
    );
    component.find('.handle').simulate('mousedown', { button: 0 });
    act(() => { map.mousemove({ pageX: 25 }); });
    expect(onChange.calledWith(sinon.match({ value: 11 }))).toBe(true);
  });

  it('shouldn\'t trigger onChange event on mouse move when slider is ' +
    'disabled', () => {
    const ref = createRef();
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    const onChange = sinon.spy();
    const component = mount(
      <SliderField
        ref={ref}
        globalEventsTarget={document}
        disabled={true}
        onChange={onChange}
      />
    );
    component.find('.handle').simulate('mousedown', { button: 0 });
    expect(ref.current.moving).toBe(true);
    act(() => { map.mousemove({ pageX: 25 }); });
    expect(onChange.called).toBe(false);
  });

  it('should allow to move slider using arrow keys', () => {
    const ref = createRef();
    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    const component = mount(
      <SliderField
        ref={ref}
        globalEventsTarget={document}
        min={0}
        max={100}
        step={10}
        value={0}
      />
    );

    component.find('.handle').simulate('keydown', { key: 'ArrowRight' });
    expect(ref.current.internalValue).toBe(10);

    component.find('.handle').simulate('keydown', { key: 'ArrowRight' });
    expect(ref.current.internalValue).toBe(20);

    component.find('.handle').simulate('keydown', { key: 'ArrowLeft' });
    expect(ref.current.internalValue).toBe(10);

    component.find('.handle').simulate('keydown', { key: 'ArrowDown' });
    expect(ref.current.internalValue).toBe(100);

    component.find('.handle').simulate('keydown', { key: 'ArrowUp' });
    expect(ref.current.internalValue).toBe(0);

    component.find('.handle').simulate('keydown', { key: 'PageUp' });
    expect(ref.current.internalValue).toBe(0);
  });
});
