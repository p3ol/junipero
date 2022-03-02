import { createRef } from 'react';
import {
  render,
  fireEvent,
  act,
  waitFor,
  createEvent,
} from '@testing-library/react';

import ColorField from './';

describe('<ColorField />', () => {
  it('should render', () => {
    const { container, unmount } = render(<ColorField autoFocus={true} />);
    expect(container.querySelectorAll('.junipero.color-input').length).toBe(1);
    expect(container.querySelectorAll('.pigment').length).toBe(1);
    unmount();
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const { container, unmount } = render(<ColorField ref={ref} />);
    expect(ref.current.innerRef).toBeDefined();
    expect(container.querySelector('.junipero.color-input'))
      .toBe(ref.current.innerRef.current);
    expect(ref.current.inputRef).toBeDefined();
    expect(ref.current.colorWheelRef).toBeDefined();
    expect(ref.current.colorLightnessRef).toBeDefined();
    expect(ref.current.colorHueRef).toBeDefined();
    expect(ref.current.colorAlphaRef).toBeDefined();
    expect(ref.current.opened).toBe(false);
    expect(ref.current.reset).toBeDefined();
    expect(ref.current.focus).toBeDefined();
    expect(ref.current.blur).toBeDefined();
    expect(ref.current.h).toBe(0);
    expect(ref.current.s).toBe(0);
    expect(ref.current.v).toBe(0);
    expect(ref.current.a).toBe(100);
    expect(ref.current.valid).toBe(false);
    unmount();
  });

  it('should update internal value if value prop changes', () => {
    const ref = createRef();
    const { rerender, unmount } = render(<ColorField ref={ref} value="#FFF" />);
    rerender(<ColorField ref={ref} value="#000" />);
    expect(ref.current.internalValue).toBe('#000');
    unmount();
  });

  it('should fire onFocus/onBlur events', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { container, unmount } = render(
      <ColorField onFocus={onFocus} onBlur={onBlur} />
    );
    container.querySelector('input').focus();
    expect(onFocus).toHaveBeenCalled();
    container.querySelector('input').blur();
    expect(onBlur).toHaveBeenCalled();
    unmount();
  });

  it('should update values when mouse is down and lightness handle is ' +
    'selected', async () => {
    const ref = createRef();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );
    fireEvent.mouseDown(container.querySelector('.lightness'), { button: 0 });
    expect(ref.current.handleMoving).toBe(true);
    expect(ref.current.handleType).toBe('lightness');

    // Man testing is weird
    await act(async () => {
      window.pageXOffset = 50;
      window.pageYOffset = 50;

      // Simulate element width/height
      Object.defineProperty(
        ref.current.colorLightnessRef.current,
        'offsetWidth',
        { value: 100 }
      );
      Object.defineProperty(
        ref.current.colorLightnessRef.current,
        'offsetHeight',
        { value: 100 }
      );
    });

    // Testing library (or jsdom?) doesn't support pageX/Y if passed
    // using fireEvent.mouseMove (lol), so we have to first create the event,
    // hard code the pageX and pageY values using .defineProperty, and then
    // give them straight to fireEvent (not fireEvent.mouseMove, this does
    // not work either)
    const moveEvent = createEvent
      .mouseMove(container.querySelector('.lightness'));
    Object.defineProperty(moveEvent, 'pageX', { value: 100 });
    Object.defineProperty(moveEvent, 'pageY', { value: 100 });

    fireEvent(container.querySelector('.lightness'), moveEvent);
    expect(ref.current.s).toBe(50);
    expect(ref.current.v).toBe(50);
    unmount();
  });

  it('should update values when mouse is down and hue handle is ' +
    'selected', async () => {
    const ref = createRef();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );

    fireEvent.mouseDown(container.querySelector('.hue'), { button: 0 });
    expect(ref.current.handleMoving).toBe(true);
    expect(ref.current.handleType).toBe('hue');

    await act(async () => {
      window.pageXOffset = 50;
      Object.defineProperty(
        ref.current.colorHueRef.current,
        'offsetWidth',
        { value: 100 }
      );
    });

    const moveEvent = createEvent
      .mouseMove(container.querySelector('.hue'));
    Object.defineProperty(moveEvent, 'pageX', { value: 100 });
    fireEvent(container.querySelector('.hue'), moveEvent);

    expect(ref.current.h).toBe(180);
    unmount();
  });

  it('should update values when mouse is down and alpha handle is ' +
    'selected', async () => {
    const ref = createRef();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );

    fireEvent.mouseDown(container.querySelector('.alpha'), { button: 0 });
    expect(ref.current.handleMoving).toBe(true);
    expect(ref.current.handleType).toBe('alpha');

    await act(async () => {
      window.pageXOffset = 50;
      Object.defineProperty(
        ref.current.colorAlphaRef.current,
        'offsetWidth',
        { value: 100 }
      );
    });

    const moveEvent = createEvent
      .mouseMove(container.querySelector('.alpha'));
    Object.defineProperty(moveEvent, 'pageX', { value: 100 });
    fireEvent(container.querySelector('.alpha'), moveEvent);

    expect(ref.current.a).toBe(50);
    unmount();
  });

  it('should close color menu and trigger onBlur event if clicked ' +
    'outside', async () => {
    const ref = createRef();
    const onBlur = jest.fn();

    const { container, unmount } = render(
      <ColorField onBlur={onBlur} ref={ref} />
    );

    container.querySelector('input').focus();
    await waitFor(() => {
      expect(ref.current.opened).toBe(true);
    });

    container.querySelector('input').blur();
    fireEvent.click(document.body);
    await waitFor(() => {
      expect(ref.current.opened).toBe(false);
    });

    expect(onBlur).toHaveBeenCalled();
    unmount();
  });

  it('should not close color menu if input is clicked', async () => {
    const ref = createRef();
    const { container, unmount } = render(<ColorField ref={ref} />);
    container.querySelector('input').focus();
    await waitFor(() => {
      expect(ref.current.opened).toBe(true);
    });
    fireEvent.click(container.querySelector('.junipero.dropdown-toggle'));
    expect(ref.current.opened).toBe(true);
    unmount();
  });

  it('should set color cursors as moving on mouse down event', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );
    fireEvent.mouseDown(container.querySelector('.lightness'), { button: 0 });
    expect(ref.current.handleMoving).toBe(true);
    expect(ref.current.handleType).toBe('lightness');
    unmount();
  });

  it('should not move color cursors as moving if clicked button is not 0 ' +
    '(left click)', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );
    fireEvent.mouseDown(container.querySelector('.lightness'), { button: 1 });
    expect(ref.current.handleMoving).toBe(false);
    expect(ref.current.handleType).toBeNull();
    unmount();
  });

  it('should set color cursors as not moving on mouse up event', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );
    fireEvent.mouseDown(container.querySelector('.lightness'), { button: 0 });
    expect(ref.current.handleMoving).toBe(true);
    expect(ref.current.handleType).toBe('lightness');
    fireEvent.mouseUp(document.body);
    expect(ref.current.handleMoving).toBe(false);
    unmount();
  });

  it('should fire onToggle event when opened/closed', async () => {
    const ref = createRef();
    const onToggle = jest.fn();
    const { container, unmount } = render(
      <ColorField ref={ref} onToggle={onToggle} />
    );

    await act(async () => { container.querySelector('input').focus(); });
    expect(ref.current.opened).toBe(true);
    expect(onToggle)
      .toHaveBeenCalledWith(expect.objectContaining({ opened: true }));

    fireEvent.click(document.body);
    expect(ref.current.opened).toBe(false);
    expect(onToggle)
      .toHaveBeenCalledWith(expect.objectContaining({ opened: false }));

    unmount();
  });

  it('should allow to reset input to its original value', async () => {
    const ref = createRef();
    const { container, unmount } = render(
      <ColorField ref={ref} value="#000" />
    );
    expect(ref.current.internalValue).toBe('#000');
    expect(ref.current.h).toBe(0);
    expect(ref.current.s).toBe(0);
    expect(ref.current.v).toBe(100);
    expect(ref.current.a).toBe(100);
    fireEvent
      .change(container.querySelector('input'), { target: { value: '#F00' } });
    expect(ref.current.internalValue).toBe('#F00');
    expect(ref.current.h).toBe(0);
    expect(ref.current.s).toBe(100);
    expect(ref.current.v).toBe(0);
    expect(ref.current.a).toBe(100);
    await act(async () => { ref.current.reset(); });
    expect(ref.current.internalValue).toBe('#000');
    expect(ref.current.h).toBe(0);
    expect(ref.current.s).toBe(0);
    expect(ref.current.v).toBe(100);
    expect(ref.current.a).toBe(100);
    unmount();
  });

  it('should allow to not have a preview', () => {
    const { container, unmount } = render(
      <ColorField previewEnabled={false} value="#F00" />
    );
    expect(container.querySelectorAll('.pigment').length).toBe(0);
    unmount();
  });
});
