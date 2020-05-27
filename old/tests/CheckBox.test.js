import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import CheckBox from '../src/CheckBox';

describe('<CheckBox />', () => {

  it('should render', () => {
    const component = shallow(<CheckBox />);
    expect(component.find('.junipero-check-box').length).toBe(1);
  });

  it('should have a default onChange handler', () => {
    expect(CheckBox.defaultProps.onChange).toBeDefined();
    expect(CheckBox.defaultProps.onChange()).not.toBeDefined();
  });

  it('should be active when mouse down event is fired', () => {
    const component = shallow(<CheckBox />);
    component.find('label').simulate('mousedown');
    expect(component.state('active')).toBe(true);
  });

  it('shouldn\'t be active when mouse down event is fired and disabled ' +
    'is true', () => {
    const component = shallow(<CheckBox disabled={true} />);
    component.find('label').simulate('mousedown');
    expect(component.state('active')).toBe(false);
  });

  it('should fire onChange event handler when checking checkbox', () => {
    const onChange = sinon.spy();
    const component = shallow(<CheckBox onChange={onChange} value="test" />);
    component.find('input').simulate('change', { target: { checked: true } });
    expect(onChange.calledWith(sinon.match.has('checked', true))).toBe(true);
    expect(onChange.calledWith(sinon.match.has('value', 'test'))).toBe(true);
  });

  it('should reset checkbox when reset() is called', () => {
    const onChange = sinon.spy();
    const component = mount(<CheckBox onChange={onChange} />);
    component.find('input').simulate('change', { target: { checked: true } });
    expect(onChange.calledWith(sinon.match.has('checked', true))).toBe(true);
    component.instance().reset();
    expect(onChange.calledWith(sinon.match.has('checked', false))).toBe(true);
    expect(onChange.calledWith(sinon.match.has('value', ''))).toBe(true);
  });

  it('shouldn\'t fire onChange event if disabled', () => {
    const onChange = sinon.spy();
    const component = shallow(<CheckBox onChange={onChange} disabled={true} />);
    component.find('input').simulate('change', { target: { checked: true } });
    expect(onChange.called).toBe(false);
  });

  it('shouldn\'t fire onChange event on checked prop change', () => {
    const onChange = sinon.spy();
    const component = shallow(<CheckBox onChange={onChange} />);
    component.setProps({ checked: true });
    expect(onChange.called).toBe(false);
  });

  it('should update internal checked state when checked prop changes', () => {
    const component = shallow(<CheckBox />);
    expect(component.state('checked')).toBe(false);
    component.setProps({ checked: true });
    expect(component.state('checked')).toBe(true);
  });

  it('should set active state to false on document mouse up event', () => {
    const map = {};
    document.addEventListener = (event, cb) => { map[event] = cb; };
    const component = shallow(<CheckBox />);
    map.mouseup();
    expect(component.state('active')).toBe(false);
  });

  it('should remove document mouse up event handler on unmount', () => {
    const map = {};
    document.addEventListener = jest.fn((event, cb) => { map[event] = cb; });
    document.removeEventListener = jest
      .fn((event, cb) => { map[event] = null; });

    const component = mount(<CheckBox />);
    component.unmount();
    expect(map.mouseup).toBeFalsy();
  });

  it('should fire onChange event with a null value if unchecked', () => {
    const onChange = sinon.spy();
    const component = shallow(<CheckBox onChange={onChange} value="test" />);
    component.find('input').simulate('change', { target: { checked: false } });
    expect(onChange.calledWith(sinon.match.has('value', null))).toBe(true);
  });

});
