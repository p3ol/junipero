import React, { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import TextField from './';

describe('<TextField />', () => {
  it('should render', () => {
    const { container, unmount } = render(<TextField placeholder="Text" />);
    expect(container.querySelectorAll('.junipero.field.text-input').length)
      .toBe(1);
    unmount();
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const { container, unmount } = render(<TextField value="test" ref={ref} />);
    expect(ref.current.innerRef.current).toBeDefined();
    expect(container.querySelector('.junipero.field'))
      .toBe(ref.current.innerRef.current);
    expect(ref.current.inputRef.current).toBeDefined();
    expect(container.querySelector('input'))
      .toBe(ref.current.inputRef.current);
    expect(ref.current.internalValue).toBe('test');
    expect(ref.current.focus).toBeDefined();
    expect(ref.current.blur).toBeDefined();
    expect(ref.current.reset).toBeDefined();
    expect(ref.current.valid).toBeDefined();
    expect(ref.current.dirty).toBeDefined();
    expect(ref.current.focused).toBeDefined();
    unmount();
  });

  it('should correctly fire onChange event', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(<TextField onChange={onChange} />);
    fireEvent
      .change(container.querySelector('input'), { target: { value: 't' } });
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ value: 't' }));
    unmount();
  });

  it('should not fire onChange event if field is disabled', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <TextField disabled onChange={onChange} />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 't' } });
    expect(onChange).not.toHaveBeenCalled();
    unmount();
  });

  it('should update state value when prop value changes', () => {
    const fieldRef = createRef();
    const { rerender, unmount } = render(<TextField ref={fieldRef} />);
    expect(fieldRef.current.internalValue).toBe('');
    rerender(
      <TextField value="400" ref={fieldRef} />
    );
    expect(fieldRef.current.internalValue).toBe('400');
    unmount();
  });

  it('should automatically focus field when autoFocus is enabled', async () => {
    const { container, unmount } = render(
      <TextField tabIndex={0} autoFocus={true} />
    );
    expect(document.activeElement).toBe(container.querySelector('input'));
    unmount();
  });

  it('should focus/blur wanted input when using forwarded ' +
    'methods', async () => {
    const ref = createRef();
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { container, unmount } = render(
      <TextField onFocus={onFocus} onBlur={onBlur} ref={ref} />
    );
    await act(async () => { ref.current.focus(); });
    expect(document.activeElement).toBe(container.querySelector('input'));
    expect(onFocus).toHaveBeenCalled();
    await act(async () => { ref.current.blur(); });
    expect(document.activeElement).toBe(document.body);
    expect(onBlur).toHaveBeenCalled();
    unmount();
  });

  it('should allow to reset field using forwarded method', async () => {
    const ref = createRef();
    const onChange = jest.fn();
    const { container, unmount } = render(
      <TextField ref={ref} value="foo" onChange={onChange} />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'bar' } });
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ value: 'bar' }));
    expect(ref.current.dirty).toBe(true);
    await act(async () => ref.current.reset());
    expect(onChange)
      .not.toHaveBeenLastCalledWith(expect.objectContaining({ value: 'foo' }));
    expect(ref.current.internalValue).toBe('foo');
    expect(ref.current.dirty).toBe(false);
    unmount();
  });

  it('should set field as invalid if validation fails', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <TextField ref={ref} validate={val => /^[0-9]+$/g.test(val)} />
    );
    expect(ref.current.valid).toBe(false);
    fireEvent
      .change(container.querySelector('input'), { target: { value: '1' } });
    expect(ref.current.internalValue).toBe('1');
    expect(ref.current.valid).toBe(true);
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'a' } });
    expect(ref.current.internalValue).toBe('a');
    expect(ref.current.valid).toBe(false);
    unmount();
  });

  it('should set field as invalid if field is required, dirty and ' +
    'empty', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <TextField ref={ref} required={true} />
    );
    expect(ref.current.valid).toBe(false);
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'a' } });
    expect(ref.current.internalValue).toBe('a');
    expect(ref.current.valid).toBe(true);
    fireEvent
      .change(container.querySelector('input'), { target: { value: '' } });
    expect(ref.current.internalValue).toBe('');
    expect(ref.current.valid).toBe(false);
    unmount();
  });

  it('should allow to reset field even if value prop is not ' +
    'defined', async () => {
    const ref = createRef();
    const { unmount } = render(<TextField ref={ref} />);
    expect(ref.current.internalValue).toBe('');
    await act(async () => ref.current.reset());
    expect(ref.current.internalValue).toBe('');
    unmount();
  });

  it('should toggle focused state on inner input focus/blur', async () => {
    const ref = createRef();
    const { container, unmount } = render(<TextField ref={ref} />);
    expect(ref.current.focused).toBe(false);
    await act(async () => { container.querySelector('input').focus(); });
    expect(ref.current.focused).toBe(true);
    await act(async () => { container.querySelector('input').blur(); });
    expect(ref.current.focused).toBe(false);
    unmount();
  });

  it('should allow to render a multiline textarea', () => {
    const ref = createRef();
    const { container, unmount } = render(<TextField rows={10} ref={ref} />);
    expect(container.querySelectorAll('textarea').length).toBe(1);
    unmount();
  });

  it('should set text field as invalid if valid prop is changed', () => {
    const ref = createRef();
    const { container, rerender, unmount } = render(
      <TextField ref={ref} label="Label" placeholder="Placeholder" />
    );
    fireEvent
      .change(container.querySelector('input'), { target: { value: 'a' } });
    expect(ref.current.valid).toBe(true);
    rerender(
      <TextField
        ref={ref}
        label="Label"
        placeholder="Placeholder"
        valid={false}
      />
    );
    expect(ref.current.valid).toBe(false);
    unmount();
  });
});
