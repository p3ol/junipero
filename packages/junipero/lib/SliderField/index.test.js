import React, { createRef } from 'react';
import { render, fireEvent, act, createEvent } from '@testing-library/react';

import SliderField from './';

describe('<SliderField />', () => {
  it('should render', async () => {
    const ref = createRef();
    const { container, unmount } = render(<SliderField ref={ref} />);
    expect(container.querySelectorAll('.junipero.slider').length).toBe(1);
    unmount();
  });

  it('should initialize if value prop is defined on mount', () => {
    const ref = createRef();
    const { unmount } = render(<SliderField ref={ref} value={10} />);
    expect(ref.current.internalValue).toBe(10);
    unmount();
  });

  it('should update precision when changing step', () => {
    const ref = createRef();
    const { rerender, unmount } = render(<SliderField ref={ref} />);
    expect(ref.current.precision).toBe(0);
    rerender(<SliderField ref={ref} step={0.1} />);
    expect(ref.current.precision).toBe(1);
    unmount();
  });

  it('should update internal value when value prop changes', () => {
    const ref = createRef();
    const { rerender, unmount } = render(<SliderField ref={ref} />);
    expect(ref.current.internalValue).toBe(0);
    rerender(<SliderField ref={ref} value={10} />);
    expect(ref.current.internalValue).toBe(10);
    unmount();
  });

  it('should return a value rounded to the correct step & precision', () => {
    const ref = createRef();
    const { rerender, unmount } = render(
      <SliderField ref={ref} min={0} max={100} step={1} />
    );
    rerender(
      <SliderField ref={ref} min={0} max={100} step={1} value={15.6} />
    );
    expect(ref.current.internalValue).toBe(16);

    rerender(
      <SliderField ref={ref} min={0} max={100} step={1} value={-5} />
    );
    expect(ref.current.internalValue).toBe(0);

    rerender(
      <SliderField ref={ref} min={0} max={100} step={1} value={255.155435} />
    );
    expect(ref.current.internalValue).toBe(100);

    rerender(
      <SliderField ref={ref} min={0} max={100} step={0.1} value={15.6} />
    );
    expect(ref.current.internalValue).toBe(15.6);

    rerender(
      <SliderField ref={ref} min={0} max={100} step={0.1} value={15.68} />
    );
    expect(ref.current.internalValue).toBe(15.7);

    rerender(
      <SliderField ref={ref} min={0} max={100} step={0.1} value={-5.546} />
    );
    expect(ref.current.internalValue).toBe(0);

    rerender(
      <SliderField ref={ref} min={0} max={100} step={0.1} value={255.155435} />
    );
    expect(ref.current.internalValue).toBe(100);

    rerender(
      <SliderField ref={ref} min={0} max={1000} step={10} value={156} />
    );
    expect(ref.current.internalValue).toBe(160);

    rerender(
      <SliderField ref={ref} min={0} max={1000} step={10} value={-5.546} />
    );
    expect(ref.current.internalValue).toBe(0);

    rerender(
      <SliderField ref={ref} min={0} max={1000} step={10} value={255.155435} />
    );
    expect(ref.current.internalValue).toBe(260);

    unmount();
  });

  it('should set slider as moving on mouse down', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <SliderField ref={ref} />
    );
    fireEvent.mouseDown(container.querySelector('.handle'), { button: 0 });
    expect(ref.current.moving).toBe(true);

    fireEvent.mouseUp(document.body);
    expect(ref.current.moving).toBe(false);

    fireEvent.mouseDown(container.querySelector('.handle'), { button: 1 });
    expect(ref.current.moving).toBe(false);

    fireEvent.mouseUp(document.body);
    expect(ref.current.moving).toBe(false);

    unmount();
  });

  it('should trigger onChange event on mouse move', async () => {
    const ref = createRef();
    const onChange = jest.fn();
    const { container, unmount } = render(
      <SliderField ref={ref} onChange={onChange} min={0} max={100} step={1} />
    );

    await act(async () => {
      Object.defineProperty(
        ref.current.slideRef.current,
        'offsetWidth',
        { value: 234 }
      );
    });
    fireEvent.mouseDown(container.querySelector('.handle'), { button: 0 });

    const moveEvent = createEvent
      .mouseMove(container.querySelector('.handle'));
    Object.defineProperty(moveEvent, 'pageX', { value: 25 });
    fireEvent(container.querySelector('.handle'), moveEvent);

    expect(onChange)
      .toHaveBeenCalledWith(expect.objectContaining({ value: 11 }));

    unmount();
  });

  it('shouldn\'t trigger onChange event on mouse move when slider is ' +
    'disabled', () => {
    const ref = createRef();
    const onChange = jest.fn();
    const { container, unmount } = render(
      <SliderField
        ref={ref}
        globalEventsTarget={document}
        disabled={true}
        onChange={onChange}
      />
    );
    fireEvent.mouseDown(container.querySelector('.handle'), { button: 0 });
    expect(ref.current.moving).toBe(true);

    const moveEvent = createEvent
      .mouseMove(container.querySelector('.handle'));
    Object.defineProperty(moveEvent, 'pageX', { value: 25 });
    fireEvent(container.querySelector('.handle'), moveEvent);

    expect(onChange).not.toHaveBeenCalled();
    unmount();
  });

  it('should allow to move slider using arrow keys', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <SliderField
        ref={ref}
        min={0}
        max={100}
        step={10}
        value={0}
      />
    );

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'ArrowRight' });
    expect(ref.current.internalValue).toBe(10);

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'ArrowRight' });
    expect(ref.current.internalValue).toBe(20);

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'ArrowLeft' });
    expect(ref.current.internalValue).toBe(10);

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'ArrowDown' });
    expect(ref.current.internalValue).toBe(100);

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'ArrowUp' });
    expect(ref.current.internalValue).toBe(0);

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'PageUp' });
    expect(ref.current.internalValue).toBe(0);

    unmount();
  });
});
