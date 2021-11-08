import React, { createRef } from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import TextField from './';

describe('<TextField />', () => {

  it('should render', () => {
    const component = shallow(<TextField placeholder="Text" />);
    component.find('input').simulate('change', { target: { value: 'a' } });
    expect(component.find('.junipero.field.text-input').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(<TextField value="test" ref={ref} />);
    expect(ref.current.innerRef.current).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
    expect(ref.current.inputRef.current).toBeDefined();
    expect(component.find('input').getDOMNode())
      .toBe(ref.current.inputRef.current);
    expect(ref.current.internalValue).toBe('test');
    expect(ref.current.focus).toBeDefined();
    expect(ref.current.blur).toBeDefined();
    expect(ref.current.reset).toBeDefined();
    expect(ref.current.valid).toBeDefined();
    expect(ref.current.dirty).toBeDefined();
    expect(ref.current.focused).toBeDefined();
  });

  it('should correctly fire onChange event', () => {
    const onChange = sinon.spy();
    const component = shallow(<TextField onChange={onChange} />);
    component.find('input').simulate('change', { target: { value: 't' } });
    expect(onChange.withArgs(sinon.match({ value: 't' })).called).toBe(true);
  });

  it('should not fire onChange event if field is disabled', () => {
    const onChange = sinon.spy();
    const component = shallow(<TextField disabled onChange={onChange} />);
    component.find('input').simulate('change', { target: { value: 't' } });
    expect(onChange.called).toBe(false);
  });

  it('should update state value when prop value changes', () => {
    const fieldRef = createRef();
    const component = mount(<TextField ref={fieldRef} />);
    expect(fieldRef.current?.internalValue).toBe('');
    component.setProps({ value: '400' });
    expect(fieldRef.current?.internalValue).toBe('400');
  });

  it('should automatically focus field when autoFocus is enabled', () => {
    const component = mount(<TextField autoFocus={true} />);
    expect(document.activeElement)
      .toBe(component.find('input').getDOMNode());
  });

  it('should focus/blur wanted input when using forwarded methods', () => {
    document.activeElement?.blur();
    const ref = createRef();
    const onFocus = sinon.spy();
    const onBlur = sinon.spy();
    const component = mount(
      <TextField onFocus={onFocus} onBlur={onBlur} ref={ref} />
    );
    act(() => {
      ref.current.focus();
      component.find('input').simulate('focus');
    });
    expect(document.activeElement).toBe(component.find('input').getDOMNode());
    expect(onFocus.called).toBe(true);
    act(() => {
      ref.current.blur();
      component.find('input').simulate('blur');
    });
    expect(document.activeElement).toBe(document.body);
    expect(onBlur.called).toBe(true);
  });

  it('should allow to reset field using forwarded method', () => {
    const ref = createRef();
    const onChange = sinon.spy();
    const component = mount(
      <TextField ref={ref} value="foo" onChange={onChange} />);
    component.find('input').simulate('change', { target: { value: 'bar' } });
    expect(onChange.withArgs(sinon.match({ value: 'bar' })).called).toBe(true);
    expect(ref.current.dirty).toBe(true);
    act(() => ref.current.reset());
    expect(onChange.withArgs(sinon.match({ value: 'foo' })).called).toBe(false);
    expect(ref.current.internalValue).toBe('foo');
    expect(ref.current.dirty).toBe(false);
  });

  it('should set field as invalid if validation fails', () => {
    const ref = createRef();
    const component = mount(
      <TextField ref={ref} validate={val => /^[0-9]+$/g.test(val)} />);
    expect(ref.current.valid).toBe(false);
    component.find('input').simulate('change', { target: { value: '1' } });
    expect(ref.current.internalValue).toBe('1');
    expect(ref.current.valid).toBe(true);
    component.find('input').simulate('change', { target: { value: 'a' } });
    expect(ref.current.internalValue).toBe('a');
    expect(ref.current.valid).toBe(false);
  });

  it('should set field as invalid if field is required, dirty and ' +
    'empty', () => {
    const ref = createRef();
    const component = mount(<TextField ref={ref} required={true} />);
    expect(ref.current.valid).toBe(false);
    component.find('input').simulate('change', { target: { value: 'a' } });
    expect(ref.current.internalValue).toBe('a');
    expect(ref.current.valid).toBe(true);
    component.find('input').simulate('change', { target: { value: '' } });
    expect(ref.current.internalValue).toBe('');
    expect(ref.current.valid).toBe(false);
  });

  it('should allow to reset field even if value prop is not defined', () => {
    const ref = createRef();
    mount(<TextField ref={ref} />);
    expect(ref.current.internalValue).toBe('');
    act(() => ref.current.reset());
    expect(ref.current.internalValue).toBe('');
  });

  it('should toggle focused state on inner input focus/blur', () => {
    const ref = createRef();
    const component = mount(<TextField ref={ref} />);
    expect(ref.current.focused).toBe(false);
    component.find('input').simulate('focus');
    expect(ref.current.focused).toBe(true);
    component.find('input').simulate('blur');
    expect(ref.current.focused).toBe(false);
  });

  it('should allow to render a multiline textarea', () => {
    const ref = createRef();
    const component = mount(<TextField rows={10} ref={ref} />);
    expect(component.find('textarea').length).toBe(1);
  });

  it('should set text field as invalid if valid prop is changed', () => {
    const ref = createRef();
    const component = mount(
      <TextField ref={ref} label="Label" placeholder="Placeholder" />
    );
    component.find('input').simulate('change', { target: { valud: 'a' } });
    expect(ref.current.valid).toBe(true);
    component.setProps({ valid: false });
    expect(ref.current.valid).toBe(false);
  });

});
