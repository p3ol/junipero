import React, { createRef } from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import CodeField from './index';

describe('<CodeField />', () => {

  it('should render', () => {
    const component = shallow(<CodeField />);
    component.find('input:first-child')
      .simulate('change', { target: { value: '1' } });
    expect(component.find('.junipero.field.code').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(<CodeField value="12" ref={ref} />);
    expect(ref.current.innerRef?.current).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
    expect(ref.current.inputsRef?.current).toBeDefined();
    expect(component.find('input').at(0).getDOMNode())
      .toBe(ref.current.inputsRef.current[0]);
    expect(ref.current.internalValue).toBe('12');
    expect(ref.current.focus).toBeDefined();
    expect(ref.current.blur).toBeDefined();
    expect(ref.current.reset).toBeDefined();
    expect(ref.current.valid).toBeDefined();
    expect(ref.current.dirty).toBeDefined();
  });

  it('should correctly fire onChange event', () => {
    const onChange = sinon.spy();
    const component = shallow(<CodeField onChange={onChange} />);
    component.find('input:first-child')
      .simulate('change', { target: { value: '1' } });
    expect(onChange.withArgs(sinon.match({ value: '1' })).called).toBe(true);
  });

  it('should not fire onChange event if field is disabled', () => {
    const onChange = sinon.spy();
    const component = shallow(<CodeField disabled onChange={onChange} />);
    component.find('input:first-child')
      .simulate('change', { target: { value: '1' } });
    expect(onChange.called).toBe(false);
  });

  it('should update state value when prop value changes', () => {
    const fieldRef = createRef();
    const component = mount(<CodeField ref={fieldRef} />);
    expect(fieldRef.current?.internalValue).toBe('');
    component.setProps({ value: '400' });
    expect(fieldRef.current?.internalValue).toBe('400');
  });

  it('should automatically focus field when autoFocus is enabled', () => {
    const component = mount(<CodeField autoFocus={true} />);
    expect(document.activeElement)
      .toBe(component.find('input:focus').at(0).getDOMNode());
  });

  it('should automatically switch field focus when changing value', () => {
    const component = mount(<CodeField />);
    expect(component.find('input:focus').length).toBe(0);
    component.find('input:first-child')
      .simulate('change', { target: { value: '1' } });
    expect(document.activeElement)
      .toBe(component.find('input').at(1).getDOMNode());
  });

  it('should allow navigating between inputs with arrow keys', () => {
    const component = mount(<CodeField />);
    expect(component.find('input:focus').length).toBe(0);
    component.find('input').at(0)
      .simulate('keydown', { key: 'ArrowRight' });
    expect(document.activeElement)
      .toBe(component.find('input').at(1).getDOMNode());
    component.find('input').at(1)
      .simulate('keydown', { key: 'ArrowRight' });
    expect(document.activeElement)
      .toBe(component.find('input').at(2).getDOMNode());
    component.find('input').at(2)
      .simulate('keydown', { key: 'ArrowLeft' });
    expect(document.activeElement)
      .toBe(component.find('input').at(1).getDOMNode());
  });

  it('should erase chars & move selection when hitting backspace', () => {
    const fieldRef = createRef();
    const component = mount(<CodeField ref={fieldRef} value="224" />);
    expect(fieldRef.current?.internalValue).toBe('224');
    component.find('input').at(3).simulate('keydown', { key: 'Backspace' });
    expect(fieldRef.current?.internalValue).toBe('22');
    expect(document.activeElement)
      .toBe(component.find('input').at(2).getDOMNode());
  });

  it('should not allow to move selection if field is disabled', () => {
    document.activeElement?.blur();
    const component = mount(<CodeField disabled />);
    component.find('input').at(0)
      .simulate('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(document.body);
  });

  it('should focus/blur wanted input when using forwarded methods', () => {
    document.activeElement?.blur();
    const ref = createRef();
    const component = mount(<CodeField ref={ref} />);
    ref.current.focus();
    expect(document.activeElement)
      .toBe(component.find('input').at(0).getDOMNode());
    ref.current.focus(4);
    expect(document.activeElement)
      .toBe(component.find('input').at(4).getDOMNode());
    ref.current.blur(4);
    expect(document.activeElement).toBe(document.body);
  });

  it('should allow to reset field using forwarded method', () => {
    const ref = createRef();
    const onChange = sinon.spy();
    const component = mount(
      <CodeField ref={ref} value="12" onChange={onChange} />);
    component.find('input').at(1)
      .simulate('change', { target: { value: '1' } });
    expect(onChange.withArgs(sinon.match({ value: '11' })).called).toBe(true);
    expect(ref.current.dirty).toBe(true);
    act(() => ref.current.reset());
    expect(onChange.withArgs(sinon.match({ value: '12' })).called).toBe(false);
    expect(ref.current.internalValue).toBe('12');
    expect(ref.current.dirty).toBe(false);
  });

  it('should set field as invalid if validation fails', () => {
    const ref = createRef();
    const component = mount(
      <CodeField ref={ref} validate={val => /^[0-9]+$/g.test(val)} />);
    expect(ref.current.valid).toBe(false);
    component.find('input').at(0)
      .simulate('change', { target: { value: '1' } });
    expect(ref.current.internalValue).toBe('1');
    expect(ref.current.valid).toBe(true);
    component.find('input').at(0)
      .simulate('change', { target: { value: 'a' } });
    expect(ref.current.internalValue).toBe('a');
    expect(ref.current.valid).toBe(false);
  });

  it('should set field as invalid if field is required, dirty and ' +
    'empty', () => {
    const ref = createRef();
    const component = mount(<CodeField ref={ref} required={true} />);
    expect(ref.current.valid).toBe(false);
    component.find('input').at(0)
      .simulate('change', { target: { value: '1' } });
    expect(ref.current.internalValue).toBe('1');
    expect(ref.current.valid).toBe(true);
    component.find('input').at(0)
      .simulate('change', { target: { value: '' } });
    expect(ref.current.internalValue).toBe('');
    expect(ref.current.valid).toBe(false);
  });

  it('should allow to reset field even if value prop is not defined', () => {
    const ref = createRef();
    mount(<CodeField ref={ref} />);
    expect(ref.current.internalValue).toBe('');
    act(() => ref.current.reset());
    expect(ref.current.internalValue).toBe('');
  });

});
