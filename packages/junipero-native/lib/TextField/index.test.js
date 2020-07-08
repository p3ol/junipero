import React, { createRef } from 'react';
import { render, wait, fireEvent, act } from '@testing-library/react-native';
import sinon from 'sinon';
// import { act } from 'react-dom/test-utils';

import TextField from './';

describe('<TextField />', () => {

  it('should render', async () => {
    const ref = createRef();
    const { getByTestId } = render(<TextField ref={ref} placeholder="Text" />);
    await wait(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 'a');
    expect(ref.current.internalValue).toBe('a');
    fireEvent.focus(getByTestId('TextField/Input'));
    expect(ref.current.focused).toBe(true);
    fireEvent.blur(getByTestId('TextField/Input'));
    expect(ref.current.focused).toBe(false);
  });

  it('should correctly fire onChange event', async () => {
    const onChange = sinon.spy();
    const { getByTestId } = render(<TextField onChange={onChange} />);
    await wait(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 't');
    expect(onChange.withArgs(sinon.match({ value: 't' })).called).toBe(true);
  });

  it('should not fire onChange if field is disabled', async () => {
    const onChange = sinon.spy();
    const { getByTestId } = render(<TextField disabled onChange={onChange} />);
    await wait(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 't');
    expect(onChange.called).toBe(false);
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
    const onFocus = sinon.spy();
    const onBlur = sinon.spy();
    const { getByTestId } = render(
      <TextField onFocus={onFocus} onBlur={onBlur} ref={ref} />
    );
    await wait(() => getByTestId('TextField/Input'));
    act(() => { ref.current.focus(); });
    fireEvent.focus(getByTestId('TextField/Input'));
    expect(ref.current.focused).toBe(true);
    expect(onFocus.called).toBe(true);
    act(() => { ref.current.blur(); });
    fireEvent.blur(getByTestId('TextField/Input'));
    expect(ref.current.focused).toBe(false);
    expect(onBlur.called).toBe(true);
  });

  it('should allow to reset field', async () => {
    const ref = createRef();
    const onChange = sinon.spy();
    const { getByTestId } = render(
      <TextField ref={ref} value="foo" onChange={onChange} />
    );

    await wait(() => getByTestId('TextField/Input'));
    fireEvent.changeText(getByTestId('TextField/Input'), 'bar');
    expect(onChange.withArgs(sinon.match({ value: 'bar' })).called).toBe(true);
    expect(ref.current.dirty).toBe(true);
    act(() => ref.current.reset());
    expect(onChange.withArgs(sinon.match({ value: 'foo' })).called).toBe(false);
    expect(ref.current.internalValue).toBe('foo');
    expect(ref.current.dirty).toBe(false);
  });

  it('should set field as invalid if validation fails', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <TextField ref={ref} validate={val => /^[0-9]+$/g.test(val)} />
    );
    await wait(() => getByTestId('TextField/Input'));
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
    await wait(() => getByTestId('TextField/Input'));
    expect(ref.current.valid).toBe(false);
    fireEvent.changeText(getByTestId('TextField/Input'), 'a');
    expect(ref.current.internalValue).toBe('a');
    expect(ref.current.valid).toBe(true);
    fireEvent.changeText(getByTestId('TextField/Input'), '');
    expect(ref.current.internalValue).toBe('');
    expect(ref.current.valid).toBe(false);
  });

  it('should allow to reset field even if value prop is not defined', () => {
    const ref = createRef();
    render(<TextField ref={ref} />);
    expect(ref.current.internalValue).toBe('');
    act(() => ref.current.reset());
    expect(ref.current.internalValue).toBe('');
  });

  it('should allow to manually set input as dirty', async () => {
    const ref = createRef();
    render(<TextField ref={ref} />);
    expect(ref.current.dirty).toBe(false);
    act(() => { ref.current.setDirty(true); });
    expect(ref.current.dirty).toBe(true);
  });

  it('should render a label if forceLabel is enabled', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <TextField forceLabel ref={ref} label="Label" placeholder="Placeholder" />
    );
    await wait(() => getByTestId('TextField/Label'));
    await wait(() => getByTestId('TextField/Placeholder'));
  });

  it('should render a label if input is empty', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <TextField ref={ref} label="Label" placeholder="Placeholder" />
    );
    await wait(() => getByTestId('TextField/Input'));
    await wait(() => getByTestId('TextField/Placeholder'));
    fireEvent.changeText(getByTestId('TextField/Input'), 'a');
    await wait(() => getByTestId('TextField/Label'));
  });

});
