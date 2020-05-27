import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import Toggle from '../src/Toggle';

describe('<Toggle />', () => {

  it('should render', () => {
    const component = shallow(<Toggle />);
    expect(component.find('.junipero-toggle').length).toBe(1);
  });

  it('should update internal checked state when checked prop changes', () => {
    const component = shallow(<Toggle />);
    expect(component.state('checked')).toBe(false);
    component.setProps({ checked: true });
    expect(component.state('checked')).toBe(true);
  });

  it('should set checked state to prop value when reseted', () => {
    const component = mount(<Toggle />);
    component.find('.junipero-toggle input').simulate('change', { target: {
      checked: true,
    } });
    expect(component.state('checked')).toBe(true);
    component.instance().reset();
    expect(component.state('checked')).toBe(false);
  });

  it('shouldn\'t fire onChange event when toggle is disabled', () => {
    const onChange = sinon.spy();
    const component = mount(<Toggle disabled={true} onChange={onChange} />);
    component.find('.junipero-toggle input').simulate('change', { target: {
      checked: true,
    } });
    expect(onChange.called).toBe(false);
  });

  it('should return a null value when toggle is unchecked', () => {
    const onChange = sinon.spy();
    const component = mount(<Toggle checked={true} onChange={onChange} />);
    component.find('.junipero-toggle input').simulate('change', { target: {
      checked: false,
    } });
    expect(onChange.calledWith(sinon.match.has('value', null))).toBe(true);
  });

});
