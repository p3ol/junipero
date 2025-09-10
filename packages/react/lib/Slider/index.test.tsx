import { createRef } from 'react';
import { render, fireEvent, act, createEvent } from '@testing-library/react';
import { vi } from 'vitest';

import Slider, { type SliderRef } from './';

describe('<Slider />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Slider />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should update precision when changing step', () => {
    const ref = createRef<SliderRef>();
    const { rerender, unmount } = render(<Slider ref={ref} />);
    expect(ref.current.precision).toBe(0);
    rerender(<Slider ref={ref} step={0.1} />);
    expect(ref.current.precision).toBe(1);
    unmount();
  });

  it('should return a value rounded to the correct step & precision', () => {
    const ref = createRef<SliderRef>();
    const { rerender, unmount } = render(
      <Slider ref={ref} min={0} max={100} step={1} />
    );
    rerender(
      <Slider ref={ref} min={0} max={100} step={1} value={15.6} />
    );
    expect(ref.current.value).toBe(16);

    rerender(
      <Slider ref={ref} min={0} max={100} step={1} value={-5} />
    );
    expect(ref.current.value).toBe(0);

    rerender(
      <Slider ref={ref} min={0} max={100} step={1} value={255.155435} />
    );
    expect(ref.current.value).toBe(100);

    rerender(
      <Slider ref={ref} min={0} max={100} step={0.1} value={15.6} />
    );
    expect(ref.current.value).toBe(15.6);

    rerender(
      <Slider ref={ref} min={0} max={100} step={0.1} value={15.68} />
    );
    expect(ref.current.value).toBe(15.7);

    rerender(
      <Slider ref={ref} min={0} max={100} step={0.1} value={-5.546} />
    );
    expect(ref.current.value).toBe(0);

    rerender(
      <Slider ref={ref} min={0} max={100} step={0.1} value={255.155435} />
    );
    expect(ref.current.value).toBe(100);

    rerender(
      <Slider ref={ref} min={0} max={1000} step={10} value={156} />
    );
    expect(ref.current.value).toBe(160);

    rerender(
      <Slider ref={ref} min={0} max={1000} step={10} value={-5.546} />
    );
    expect(ref.current.value).toBe(0);

    rerender(
      <Slider ref={ref} min={0} max={1000} step={10} value={255.155435} />
    );
    expect(ref.current.value).toBe(260);

    unmount();
  });

  it('should set slider as moving on mouse down', () => {
    const ref = createRef<SliderRef>();
    const { container, unmount } = render(
      <Slider ref={ref} />
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

  it('should trigger onMove event on mouse move', async () => {
    const ref = createRef<SliderRef>();
    const onMove = vi.fn();
    const { container, unmount } = render(
      <Slider ref={ref} onMove={onMove} min={0} max={100} step={1} />
    );

    await act(async () => {
      Object.defineProperty(
        ref.current.slideRef.current,
        'offsetWidth',
        { value: 234 }
      );

      return Promise.resolve();
    });
    fireEvent.mouseDown(container.querySelector('.handle'), { button: 0 });

    const moveEvent = createEvent
      .mouseMove(container.querySelector('.handle'));
    Object.defineProperty(moveEvent, 'pageX', { value: 25 });
    fireEvent(container.querySelector('.handle'), moveEvent);

    expect(onMove).toHaveBeenCalledWith(11);

    unmount();
  });

  it('shouldn\'t trigger onMove event on mouse move when slider is ' +
    'disabled', () => {
    const ref = createRef<SliderRef>();
    const onMove = vi.fn();
    const { container, unmount } = render(
      <Slider
        ref={ref}
        globalEventsTarget={document}
        disabled={true}
        onMove={onMove}
      />
    );
    fireEvent.mouseDown(container.querySelector('.handle'), { button: 0 });
    expect(ref.current.moving).toBe(false);

    const moveEvent = createEvent
      .mouseMove(container.querySelector('.handle'));
    Object.defineProperty(moveEvent, 'pageX', { value: 25 });
    fireEvent(container.querySelector('.handle'), moveEvent);

    expect(onMove).not.toHaveBeenCalled();
    unmount();
  });

  it('should allow to move slider using arrow keys', () => {
    const ref = createRef<SliderRef>();
    const { container, unmount } = render(
      <Slider
        ref={ref}
        min={0}
        max={100}
        step={10}
        value={0}
      />
    );

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'ArrowRight' });
    expect(ref.current.value).toBe(10);

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'ArrowRight' });
    expect(ref.current.value).toBe(20);

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'ArrowLeft' });
    expect(ref.current.value).toBe(10);

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'ArrowDown' });
    expect(ref.current.value).toBe(100);

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'ArrowUp' });
    expect(ref.current.value).toBe(0);

    fireEvent
      .keyDown(container.querySelector('.handle'), { key: 'PageUp' });
    expect(ref.current.value).toBe(0);

    unmount();
  });
});
