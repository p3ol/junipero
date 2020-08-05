import React, { createRef } from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';

import CodeField from '../src/CodeField';

describe('<CodeField />', () => {

  it('should render', () => {
    const component = shallow(<CodeField />);
    expect(component.find('.junipero-code-field').length).toBe(1);
  });

  it('should have a default onChange handler', () => {
    expect(CodeField.defaultProps.onChange).toBeDefined();
    expect(CodeField.defaultProps.onChange()).not.toBeDefined();
  });

  it('should fire onChange event handler when updated', () => {
    const onChange = sinon.spy();
    const component = shallow(<CodeField onChange={onChange} />);
    component
      .find('input')
      .first()
      .simulate('change', { target: { value: '0' } });

    expect(onChange.calledWith(sinon.match.has('value', '0'))).toBe(true);
    expect(onChange.calledWith(sinon.match.has('valid', false))).toBe(true);
  });

  it('should validate value with default predicate', () => {
    expect(CodeField.defaultProps.validate).toBeDefined();
    expect(CodeField.defaultProps.validate('test')).toBe(true);
    expect(CodeField.defaultProps.validate()).toBe(false);
  });

  it('should focus the first digit when autofocus is true', () => {
    const { container } = render(<CodeField autofocus={true} />);
    expect(container.querySelector('input:first-child:focus')).toBeTruthy();
  });

  it('should update internal value when value prop changes', () => {
    const component = shallow(<CodeField />);
    expect(component.state('values').join('')).toBe('');
    component.setProps({ value: '123456' });
    expect(component.state('values').join('')).toBe('123456');
    component.setProps({ value: null });
    expect(component.state('values').join('')).toBe('');
  });

  it('should update internal value when any digit value changes', () => {
    const component = mount(<CodeField />);
    component.find('input').first().simulate('change');
    component.find('input').first()
      .simulate('change', { target: { value: 1 } });
    expect(component.state('values').join('')).toBe('1');
  });

  it('should update internal value when hitting backspace', () => {
    const component = mount(<CodeField />);
    component.find('input').first()
      .simulate('change', { target: { value: 1 } });
    component.find('input').at(1).simulate('focus');
    component.find('input').at(1).simulate('keydown', { key: 'Backspace' });
    expect(component.state('values').join('')).toBe('');
  });

  it('should not update internal value if disabled', () => {
    const component = mount(<CodeField disabled={true} value="1" />);
    component.find('input').first()
      .simulate('change', { target: { value: 2 } });
    component.find('input').at(1).simulate('focus');
    component.find('input').at(1).simulate('keydown', { key: 'Backspace' });
    expect(component.state('values').join('')).toBe('1');
  });

  it('should not erase previous digit if hitting backspace in next one ' +
    'when something is selected or text is remaining in input', () => {
    const ref = createRef();
    const { container } = render(<CodeField ref={ref} value="123" />);
    fireEvent.focus(container.querySelector('input:nth-child(2)'));
    container.querySelector('input:nth-child(2)').setSelectionRange(1, 1);
    fireEvent.keyDown(
      container.querySelector('input:nth-child(2)'), { key: 'Backspace' });
    expect(ref.current.state.values.join('')).toBe('123');
  });

  it('should move to the next digit if hitting arrow right after text', () => {
    const { container } = render(<CodeField value="123" />);
    fireEvent.focus(container.querySelector('input:nth-child(2)'));
    fireEvent.keyDown(
      container.querySelector('input:nth-child(2)'), { key: 'ArrowRight' });
    expect(container.querySelector('input:nth-child(3):focus')).toBeTruthy();
  });

  it('should not move to the next digit if hitting arrow right if text is ' +
    'selected', () => {
    const { container } = render(<CodeField value="123" />);
    fireEvent.focus(container.querySelector('input:nth-child(2)'));
    container.querySelector('input:nth-child(2)').setSelectionRange(0, 1);
    fireEvent.keyDown(
      container.querySelector('input:nth-child(2)'), { key: 'ArrowRight' });
    expect(container.querySelector('input:nth-child(3):focus')).toBeNull();
  });

  // JSDOM/Enzyme fuckup
  it('should move to the previous digit if hitting arrow right after ' +
    'text', () => {
    const { container } = render(<CodeField value="123" />);
    fireEvent.focus(container.querySelector('input:nth-child(2)'));
    fireEvent.keyDown(
      container.querySelector('input:nth-child(2)'), { key: 'ArrowLeft' });
    expect(container.querySelector('input:first-child:focus')).toBeTruthy();
  });

  it('should not move to the next digit if hitting arrow right if text is ' +
    'selected', () => {
    const { container } = render(<CodeField value="123" />);
    fireEvent.focus(container.querySelector('input:nth-child(2)'));
    container.querySelector('input:nth-child(2)').setSelectionRange(0, 1);
    fireEvent.keyDown(
      container.querySelector('input:nth-child(2)'), { key: 'ArrowLeft' });
    expect(container.querySelector('input:first-child:focus')).toBeNull();
  });

  it('should not do anything if key is not recognized', () => {
    const { container } = render(<CodeField value="123" />);
    fireEvent.keyDown(
      container.querySelector('input:nth-child(1)'), { key: 'ArrowDown' });
    expect(container.querySelector('input:first-child:focus')).toBeNull();
  });

  it('should validate internal value with custom predicate', () => {
    const onChange = sinon.spy();
    const component = mount(
      <CodeField
        onChange={onChange}
        validate={val => val === '223456'}
        value="123456"
      />
    );
    component.find('input').first()
      .simulate('change', { target: { value: 2 } });
    expect(onChange.calledWith(sinon.match.has('valid', true))).toBe(true);
  });

});
