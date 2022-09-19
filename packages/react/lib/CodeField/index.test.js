import { createRef } from 'react';
import { fireEvent, render, act } from '@testing-library/react';

import CodeField from './index';

describe('<CodeField />', () => {
  it('should render', () => {
    const { container, unmount } = render(<CodeField />);
    expect(container.querySelectorAll('.junipero.field.code').length).toBe(1);
    unmount();
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const { container, unmount } = render(<CodeField value="12" ref={ref} />);

    expect(ref.current.innerRef?.current).toBeDefined();
    expect(container.querySelector('.junipero.field.code'))
      .toBe(ref.current.innerRef.current);
    expect(ref.current.inputsRef?.current).toBeDefined();
    expect(container.querySelectorAll('input')[0])
      .toBe(ref.current.inputsRef.current[0]);
    expect(ref.current.internalValue).toBe('12');
    expect(ref.current.focus).toBeDefined();
    expect(ref.current.blur).toBeDefined();
    expect(ref.current.reset).toBeDefined();
    expect(ref.current.valid).toBeDefined();
    expect(ref.current.dirty).toBeDefined();

    unmount();
  });

  it('should correctly fire onChange event', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(<CodeField onChange={onChange} />);

    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: '1' } });
    expect(onChange)
      .toHaveBeenCalledWith(expect.objectContaining({ value: '1' }));

    unmount();
  });

  it('should not fire onChange event if field is disabled', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <CodeField disabled onChange={onChange} />
    );

    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: '1' } });
    expect(onChange).not.toHaveBeenCalled();
    unmount();
  });

  it('should update state value when prop value changes', () => {
    const fieldRef = createRef();
    const { rerender, unmount } = render(<CodeField ref={fieldRef} />);
    expect(fieldRef.current?.internalValue).toBe('');
    rerender(<CodeField value="400" ref={fieldRef} />);
    expect(fieldRef.current?.internalValue).toBe('400');
    unmount();
  });

  it('should automatically focus field when autoFocus is enabled', () => {
    const { container, unmount } = render(<CodeField autoFocus={true} />);
    expect(document.activeElement)
      .toBe(container.querySelectorAll('input')[0]);
    unmount();
  });

  it('should automatically switch field focus when changing value', () => {
    const { container, unmount } = render(<CodeField autoFocus={true} />);
    expect(document.activeElement)
      .toBe(container.querySelectorAll('input')[0]);
    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: '1' } });
    expect(document.activeElement)
      .toBe(container.querySelectorAll('input')[1]);
    unmount();
  });

  it('should allow navigating between inputs with arrow keys', () => {
    const { container, unmount } = render(<CodeField autoFocus={true} />);

    expect(document.activeElement)
      .toBe(container.querySelectorAll('input')[0]);
    fireEvent.keyDown(container.querySelectorAll('input')[0],
      { key: 'ArrowRight' });

    expect(document.activeElement)
      .toBe(container.querySelectorAll('input')[1]);
    fireEvent.keyDown(container.querySelectorAll('input')[1],
      { key: 'ArrowRight' });

    expect(document.activeElement)
      .toBe(container.querySelectorAll('input')[2]);
    fireEvent.keyDown(container.querySelectorAll('input')[2],
      { key: 'ArrowLeft' });

    expect(document.activeElement)
      .toBe(container.querySelectorAll('input')[1]);

    unmount();
  });

  it('should erase chars & move selection when hitting backspace', () => {
    const fieldRef = createRef();
    const { container, unmount } = render(
      <CodeField ref={fieldRef} value="224" />
    );
    expect(fieldRef.current?.internalValue).toBe('224');

    fireEvent.keyDown(container.querySelectorAll('input')[3],
      { key: 'Backspace' });

    expect(fieldRef.current?.internalValue).toBe('22');
    expect(document.activeElement)
      .toBe(container.querySelectorAll('input')[2]);

    unmount();
  });

  it('should not allow to move selection if field is disabled', () => {
    document.activeElement?.blur();
    const { container, unmount } = render(<CodeField disabled />);

    fireEvent.keyDown(container.querySelectorAll('input')[0],
      { key: 'ArrowRight' });

    expect(document.activeElement).toBe(document.body);

    unmount();
  });

  it('should focus/blur wanted input when using forwarded methods', () => {
    document.activeElement?.blur();

    const ref = createRef();
    const { container, unmount } = render(<CodeField ref={ref} />);

    ref.current.focus();
    expect(document.activeElement)
      .toBe(container.querySelectorAll('input')[0]);

    ref.current.focus(4);
    expect(document.activeElement)
      .toBe(container.querySelectorAll('input')[4]);

    ref.current.blur(4);
    expect(document.activeElement).toBe(document.body);

    unmount();
  });

  it('should allow to reset field using forwarded method', async () => {
    const ref = createRef();
    const onChange = jest.fn();
    const { container, unmount } = render(
      <CodeField ref={ref} value="12" onChange={onChange} />
    );

    fireEvent.change(container.querySelectorAll('input')[1],
      { target: { value: '1' } });
    expect(onChange)
      .toHaveBeenCalledWith(expect.objectContaining({ value: '11' }));
    expect(ref.current.internalValue).toBe('11');
    expect(ref.current.dirty).toBe(true);

    await act(async () => { ref.current.reset(); });
    expect(ref.current.internalValue).toBe('12');
    expect(ref.current.dirty).toBe(false);

    unmount();
  });

  it('should set field as invalid if validation fails', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <CodeField ref={ref} validate={val => /^[0-9]+$/g.test(val)} />
    );

    expect(ref.current.valid).toBe(false);

    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: '1' } });

    expect(ref.current.internalValue).toBe('1');
    expect(ref.current.valid).toBe(true);

    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: 'a' } });

    expect(ref.current.internalValue).toBe('a');
    expect(ref.current.valid).toBe(false);

    unmount();
  });

  it('should set field as invalid if field is required, dirty and ' +
    'empty', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <CodeField ref={ref} required={true} />
    );
    expect(ref.current.valid).toBe(false);

    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: '1' } });
    expect(ref.current.internalValue).toBe('1');
    expect(ref.current.valid).toBe(true);

    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: '' } });
    expect(ref.current.internalValue).toBe('');
    expect(ref.current.valid).toBe(false);

    unmount();
  });

  it('should allow to reset field even if value prop is not ' +
    'defined', async () => {
    const ref = createRef();
    const { unmount } = render(<CodeField ref={ref} />);
    expect(ref.current.internalValue).toBe('');
    await act(async () => ref.current.reset());
    expect(ref.current.internalValue).toBe('');
    unmount();
  });
});
