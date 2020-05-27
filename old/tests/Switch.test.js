import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import Switch from '../src/Switch';

describe('<Switch />', () => {
  const options = ['One', 'Two', 'Three', 'Four'];

  it('should render', () => {
    const component = mount(<Switch options={options} />);
    expect(component.find('.junipero-switch').length).toBe(1);
    expect(component.instance().buttons.length).toBe(4);
  });

  it('should have default handlers defined', () => {
    expect(Switch.defaultProps.onChange).toBeDefined();
    expect(Switch.defaultProps.onChange()).not.toBeDefined();
    expect(Switch.defaultProps.parseTitle).toBeDefined();
    expect(Switch.defaultProps.parseTitle()).not.toBeDefined();
  });

  it('should update internal value when value prop changes', () => {
    const component = shallow(<Switch options={options} />);
    expect(component.state('value')).toBeFalsy();
    component.setProps({ value: 'One' });

    expect(component.state('value')).toBe('One');
  });

  it('should trigger onChange event if switch is disabled', () => {
    const onChange = sinon.spy();
    const component = shallow(
      <Switch disabled={true} onChange={onChange} options={options} />
    );
    component.setProps({ value: 'One' });
    expect(component.state('value')).toBeFalsy();
    expect(onChange.called).toBe(false);
  });

});
