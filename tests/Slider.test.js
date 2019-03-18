import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import Slider from '../src/Slider';

describe('<Slider />', () => {

  it('should render', () => {
    const component = shallow(<Slider />);
    expect(component.find('.junipero-slider').length).toBe(1);
  });

  it('should have default handlers defined', () => {
    expect(Slider.defaultProps.onChange).toBeDefined();
    expect(Slider.defaultProps.onChange()).not.toBeDefined();
  });

  it('should update precision when changing step', () => {
    const component = shallow(<Slider />);
    expect(component.state('precision')).toBe(0);
    component.setProps({ step: 0.1 });
    expect(component.state('precision')).toBe(1);
  });

  it('should return a value rounded to the correct step & precision', () => {
    const component = shallow(<Slider min={0} max={100} step={1} />);
    expect(component.instance().getValue(15.6)).toBe(16);
    expect(component.instance().getValue(-5)).toBe(0);
    expect(component.instance().getValue(255.155435)).toBe(100);

    component.setProps({ step: 0.1 });
    expect(component.instance().getValue(15.6)).toBe(15.6);
    expect(component.instance().getValue(15.68)).toBe(15.7);
    expect(component.instance().getValue(-5.546)).toBe(0);
    expect(component.instance().getValue(255.155435)).toBe(100);

    component.setProps({ max: 1000, step: 10 });
    expect(component.instance().getValue(156)).toBe(160);
    expect(component.instance().getValue(-5.546)).toBe(0);
    expect(component.instance().getValue(255.155435)).toBe(260);
  });

  it('should register document events to track mouse click & position', () => {
    const map = {};
    document.addEventListener = (event, cb) => map[event] = sinon.spy(cb);
    shallow(<Slider />);
    expect(map.mousemove).toBeDefined();
    expect(map.mouseup).toBeDefined();
  });

  it('should remove document events on unmount', () => {
    const map = {};
    document.addEventListener = (event, cb) => map[event] = sinon.spy(cb);
    document.removeEventListener = (event, cb) => delete map[event];

    const component = mount(<Slider />);
    expect(map.mousemove).toBeDefined();
    expect(map.mouseup).toBeDefined();

    component.unmount();
    expect(map.mousemove).not.toBeDefined();
    expect(map.mouseup).not.toBeDefined();
  });

  it('should set slider as moving on mouse down', () => {
    const component = shallow(<Slider />);
    component.find('.junipero-slider').simulate('mousedown', { button: 0 });
    expect(component.state('moving')).toBe(true);
  });

  it('shouldn\'t set slider as moving on mouse down if button isn\'t 0', () => {
    const component = shallow(<Slider />);
    component.find('.junipero-slider').simulate('mousedown', { button: 1 });
    expect(component.state('moving')).toBe(false);
  });

  it('should set slider as not moving on mouse up', () => {
    const map = {};
    document.addEventListener = (event, cb) => map[event] = sinon.spy(cb);

    const component = mount(<Slider />);
    component.find('.junipero-slider').simulate('mousedown', { button: 0 });
    expect(component.state('moving')).toBe(true);
    map.mouseup();
    expect(component.state('moving')).toBe(false);
  });

  it('should trigger onChange event on mouse move', () => {
    const map = {};
    document.addEventListener = (event, cb) => map[event] = sinon.spy(cb);

    const onChange = sinon.spy();
    const component = mount(<Slider onChange={onChange} />);
    component.find('.junipero-slider').simulate('mousedown', { button: 0 });
    expect(component.state('moving')).toBe(true);
    map.mousemove({ pageX: 0, pageY: 0 });
    expect(onChange.called).toBe(true);
  });

  it('shouldn\'t trigger onChange event on mouse move when slider is ' +
    'disabled', () => {
    const map = {};
    document.addEventListener = (event, cb) => map[event] = sinon.spy(cb);

    const onChange = sinon.spy();
    const component = mount(<Slider disabled={true} onChange={onChange} />);
    component.find('.junipero-slider').simulate('mousedown', { button: 0 });
    expect(component.state('moving')).toBe(true);
    map.mousemove({ pageX: 0, pageY: 0 });
    component.instance().onChange(0);
    expect(onChange.called).toBe(false);
  });

  it('should show a label when provided', () => {
    const component = shallow(<Slider label="label" />);
    expect(component.find('span.label').length).toBe(1);
    expect(component.find('span.label').html())
      .toBe('<span class="label">label</span>');
  });

});
