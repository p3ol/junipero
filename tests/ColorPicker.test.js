import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import ColorPicker from '../src/ColorPicker';

describe('<ColorPicker />', () => {

  it('should render', () => {
    const component = shallow(<ColorPicker />);
    expect(component.find('.junipero-color-picker').length).toBe(1);
  });

  it('should have default handlers defined', () => {
    expect(ColorPicker.defaultProps.onChange).toBeDefined();
    expect(ColorPicker.defaultProps.onChange()).not.toBeDefined();
    expect(ColorPicker.defaultProps.onBlur).toBeDefined();
    expect(ColorPicker.defaultProps.onBlur()).not.toBeDefined();
    expect(ColorPicker.defaultProps.onFocus).toBeDefined();
    expect(ColorPicker.defaultProps.onFocus()).not.toBeDefined();
  });

  it('should update internal value if value prop changes', () => {
    const component = shallow(<ColorPicker value="#FFF" />);
    component.setProps({ value: '#000' });
    expect(component.state('value')).toBe('#000');
  });

  it('should register document events to track mouse click & position', () => {
    const map = {};
    document.addEventListener = (event, cb) => map[event] = sinon.spy(cb);
    shallow(<ColorPicker />);
    expect(map.mousedown).toBeDefined();
    expect(map.mousemove).toBeDefined();
    expect(map.mouseup).toBeDefined();
  });

  it('should close color menu and trigger onBlur event if clicked ' +
    'outside', () => {
    const onBlur = sinon.spy();
    const component = mount(<ColorPicker onBlur={onBlur} />);
    component.instance().open();
    expect(component.state('opened')).toBe(true);
    component.instance().onClickOutside({ target: null });
    expect(component.state('opened')).toBe(false);
    expect(onBlur.called).toBe(true);
  });

  it('should not close color menu if input is clicked', () => {
    const component = mount(<ColorPicker />);
    component.instance().open();
    component.instance().onClickOutside({ target: component.instance().input });
    expect(component.state('opened')).toBe(true);
  });

  it('should set color cursors as moving on mouse down event', () => {
    const component = mount(<ColorPicker />);
    component.find('.lightness').simulate('mousedown', { button: 0 });
    expect(component.state('handleMoving')).toBe(true);
    expect(component.state('handleType')).toBe('lightness');
  });

  it('should not move color cursors as moving if clicked button is not 0 ' +
    '(left click)', () => {
    const component = mount(<ColorPicker />);
    component.find('.lightness').simulate('mousedown', { button: 1 });
    expect(component.state('handleMoving')).toBe(false);
    expect(component.state('handleType')).toBe(null);
  });

  // Cannot test these with Jest as it uses JSDOM and elements are mocked
  // and don't have size nor positions
  //
  // it('should update colors if cursors are moving', () => {
  //   const map = {};
  //   document.addEventListener = (event, cb) => map[event] = sinon.spy(cb);
  //   const component = mount(<ColorPicker value="#FFF" />);
  //   component.instance().open();
  //   component.find('.alpha').simulate('mousedown', { button: 0 });
  //   map.mousemove({ pageX: 1000 });
  //   expect(component.state('value')).toBe('rgba(255, 255, 255, 0)');
  // });
  //
  // it('should not update colors if cursors are not moving', () => {
  //   const map = {};
  //   document.addEventListener = (event, cb) => map[event] = sinon.spy(cb);
  //   const component = mount(<ColorPicker />);
  //   map.mousemove({ })
  // });

});
