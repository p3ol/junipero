import React, { createRef } from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';

import TextField from './';

describe('<TextField />', () => {

  it('should render', async () => {
    const ref = createRef();
    const { getByTestId } = render(<TextField ref={ref} placeholder="Text" />);
    await waitFor(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 'a');
    expect(ref.current.internalValue).toBe('a');
    fireEvent(getByTestId('TextField/Input'), 'focus');
    expect(ref.current.focused).toBe(true);
    fireEvent(getByTestId('TextField/Input'), 'blur');
    expect(ref.current.focused).toBe(false);
  });

  it('should correctly fire onChange event', async () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<TextField onChange={onChange} />);
    await waitFor(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 't');
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ value: 't' }));
  });

  it('should not fire onChange if field is disabled', async () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<TextField disabled onChange={onChange} />);
    await waitFor(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 't');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should update state value when prop value changes', () => {
    const ref = createRef();
    const { rerender } = render(<TextField ref={ref} />);
    expect(ref.current.internalValue).toBe('');
    rerender(<TextField ref={ref} value="400" />);
    expect(ref.current.internalValue).toBe('400');
  });

  it('should automatically focus field when autoFocus is enabled', () => {
    const ref = createRef();
    render(<TextField autoFocus ref={ref} />);
    expect(ref.current.focused).toBe(true);
  });

  it('should allow to focus/blur input manually', async () => {
    const ref = createRef();
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByTestId } = render(
      <TextField onFocus={onFocus} onBlur={onBlur} ref={ref} />
    );
    await waitFor(() => getByTestId('TextField/Input'));
    await act(async () => { ref.current.focus(); });
    fireEvent(getByTestId('TextField/Input'), 'focus');
    expect(ref.current.focused).toBe(true);
    expect(onFocus).toHaveBeenCalled();
    await act(async () => { ref.current.blur(); });
    fireEvent(getByTestId('TextField/Input'), 'blur');
    expect(ref.current.focused).toBe(false);
    expect(onBlur).toHaveBeenCalled();
  });

  it('should allow to reset field', async () => {
    const ref = createRef();
    const onChange = jest.fn();
    const { getByTestId } = render(
      <TextField ref={ref} value="foo" onChange={onChange} />
    );

    await waitFor(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 'bar');
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ value: 'bar' }));
    expect(ref.current.dirty).toBe(true);
    await act(async () => { ref.current.reset(); });
    expect(onChange)
      .not.toHaveBeenLastCalledWith(expect.objectContaining({ value: 'foo' }));
    expect(ref.current.internalValue).toBe('foo');
    expect(ref.current.dirty).toBe(false);
  });

  it('should set field as invalid if validation fails', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <TextField ref={ref} validate={val => /^[0-9]+$/g.test(val)} />
    );
    await waitFor(() => getByTestId('TextField/Input'));
    expect(ref.current.valid).toBe(false);
    fireEvent.changeText(getByTestId('TextField/Input'), '1');
    expect(ref.current.internalValue).toBe('1');
    expect(ref.current.valid).toBe(true);
    fireEvent.changeText(getByTestId('TextField/Input'), 'a');
    expect(ref.current.internalValue).toBe('a');
    expect(ref.current.valid).toBe(false);
  });

  it('should set field as invalid if field is required, dirty and ' +
    'empty', async () => {
    const ref = createRef();
    const { getByTestId } = render(<TextField ref={ref} required />);
    await waitFor(() => getByTestId('TextField/Input'));
    expect(ref.current.valid).toBe(false);
    fireEvent.changeText(getByTestId('TextField/Input'), 'a');
    expect(ref.current.internalValue).toBe('a');
    expect(ref.current.valid).toBe(true);
    fireEvent.changeText(getByTestId('TextField/Input'), '');
    expect(ref.current.internalValue).toBe('');
    expect(ref.current.valid).toBe(false);
  });

  it('should allow to reset field even if value prop is not ' +
    'defined', async () => {
    const ref = createRef();
    render(<TextField ref={ref} />);
    expect(ref.current.internalValue).toBe('');
    await act(async () => { ref.current.reset(); });
    expect(ref.current.internalValue).toBe('');
  });

  it('should allow to manually set input as dirty', async () => {
    const ref = createRef();
    render(<TextField ref={ref} />);
    expect(ref.current.dirty).toBe(false);
    await act(async () => { ref.current.setDirty(true); });
    expect(ref.current.dirty).toBe(true);
  });

  it('should render a label if forceLabel is enabled', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <TextField forceLabel ref={ref} label="Label" placeholder="Placeholder" />
    );
    await waitFor(() => getByTestId('TextField/Label'));
    expect(getByTestId('TextField/Placeholder')).toBeTruthy();
  });

  it('should render a label if input is empty', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <TextField ref={ref} label="Label" placeholder="Placeholder" />
    );
    await waitFor(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 'a');
    expect(getByTestId('TextField/Label')).toBeTruthy();
  });

  it('should allow to render a multiline text input', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <TextField rows={10} ref={ref} label="Label" placeholder="Placeholder" />
    );
    await waitFor(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 'a');
    expect(ref.current.internalValue).toBe('a');
  });

  it('should set text field as invalid if valid prop is changed', async () => {
    const ref = createRef();
    const { getByTestId, rerender } = render(
      <TextField ref={ref} label="Label" placeholder="Placeholder" />
    );
    await waitFor(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 'a');
    expect(ref.current.valid).toBe(true);
    rerender(
      <TextField
        ref={ref}
        valid={false}
        label="Label"
        placeholder="Placeholder"
      />
    );
    expect(ref.current.valid).toBe(false);
  });

  it('should override the default testID of the TextInput', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <TextField ref={ref} testID="test" placeholder="Text" />
    );
    expect(getByTestId('test')).toBeTruthy();
  });
});
