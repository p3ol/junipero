import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';

import TextField from '../src/TextField';

describe('<TextField />', () => {

  it('should render', () => {
    const component = shallow(<TextField />);
    expect(component.find('.junipero-text-field').length).toBe(1);
  });

  it('should fire onFocus event when input is focused', () => {
    const onFocus = sinon.spy();
    const component = shallow(<TextField onFocus={onFocus} />);
    component.find('input').simulate('focus');
    expect(onFocus.called).toBe(true);
    expect(component.state('focused')).toBe(true);
  });

  it('shouldn\'t fire onFocus event when input is focused and field ' +
    'is disabled', () => {
    const onFocus = sinon.spy();
    const component = shallow(<TextField disabled={true} onFocus={onFocus} />);
    component.find('input').simulate('focus');
    expect(onFocus.called).toBe(false);
    expect(component.state('focused')).toBe(false);
  });

  it('shouldn\'t set field as focused when input is focused and event ' +
    'is prevented', () => {
    const onFocus = sinon.spy(e => { e.defaultPrevented = true; });
    const component = shallow(<TextField onFocus={onFocus} />);
    component.find('input').simulate('focus', {});
    expect(onFocus.called).toBe(true);
    expect(component.state('focused')).toBe(false);
  });

  it('should fire onBlur event when input is blurred', () => {
    const onBlur = sinon.spy();
    const component = shallow(<TextField onBlur={onBlur} />);
    component.find('input').simulate('focus');
    expect(component.state('focused')).toBe(true);
    component.find('input').simulate('blur');
    expect(onBlur.called).toBe(true);
    expect(component.state('focused')).toBe(false);
  });

  it('shouldn\'t fire onBlur event when input is blurred and field ' +
    'is disabled', () => {
    const onBlur = sinon.spy();
    const component = shallow(<TextField onBlur={onBlur} />);
    component.find('input').simulate('focus');
    expect(component.state('focused')).toBe(true);
    component.setProps({ disabled: true });
    component.find('input').simulate('blur');
    expect(onBlur.called).toBe(false);
    expect(component.state('focused')).toBe(true);
  });

  it('shouldn\'t set field as unfocused when input is blurred and event ' +
    'is prevented', () => {
    const onBlur = sinon.spy(e => { e.defaultPrevented = true; });
    const component = shallow(<TextField onBlur={onBlur} />);
    component.find('input').simulate('focus');
    expect(component.state('focused')).toBe(true);
    component.find('input').simulate('blur', {});
    expect(onBlur.called).toBe(true);
    expect(component.state('focused')).toBe(true);
  });

  it('should parse input value as a number if prop value was a number', () => {
    const onChange = sinon.spy();
    const component = shallow(<TextField value={1.1} onChange={onChange} />);
    component.find('input').simulate('change', { target: { value: '2.23' } });
    expect(onChange.calledWith(sinon.match.has('value', 2.23))).toBe(true);
  });

  it('should fail to parse input value as a number if prop value was a ' +
    'number and new value is not', () => {
    const onChange = sinon.spy();
    const component = shallow(<TextField value={1.1} onChange={onChange} />);
    component.find('input').simulate('change', { target: { value: '2.23a' } });
    expect(onChange.calledWith(sinon.match.has('value', 0))).toBe(true);
  });

  it('should fire onChange event without any value when reseted', () => {
    const onChange = sinon.spy();
    const component = shallow(<TextField onChange={onChange} />);
    component.find('input').simulate('change', { target: { value: 'test' } });
    expect(onChange.calledWith(sinon.match.has('value', 'test'))).toBe(true);
    onChange.resetHistory();
    component.instance().reset();
    expect(onChange.calledWith(sinon.match.has('value'))).toBe(false);
  });

  // Enzyme/JSDOM is fucked up for this one
  it('should focus/blur input when calling focus/blur methods', async () => {
    const { container } = render(<TextField />);
    fireEvent.focus(container.querySelector('input'));
    expect(/focused/.test(container.querySelector('.junipero-field').className)).toBe(true);
    fireEvent.blur(container.querySelector('input'));
    expect(/focused/.test(container.querySelector('.junipero-field').className)).toBe(false);
  });

  it('should render an email input if type is email', () => {
    const component = shallow(<TextField type="email" />);
    expect(component.find('input[type="email"]').length).toBe(1);
  });

  it('should render a tel input if type is tel', () => {
    const component = shallow(<TextField type="tel" />);
    expect(component.find('input[type="tel"]').length).toBe(1);
  });

  it('should render a textarea if field is multiline', () => {
    const component = shallow(<TextField rows={10} />);
    expect(component.find('textarea').length).toBe(1);
  });

  it('should show an error when provided', () => {
    const component = shallow(<TextField error="error" />);
    expect(component.find('.error').length).toBe(1);
    expect(component.find('.error').html())
      .toBe('<span class="error">error</span>');
  });

});
