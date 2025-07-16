import { createRef } from 'react';
import {
  render,
  fireEvent,
  act,
  createEvent,
} from '@testing-library/react';

import ColorField, { ColorFieldRef } from '.';

describe('<ColorField />', () => {
  it('should render', () => {
    const { container, unmount } = render(<ColorField autoFocus={true} />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should update values when mouse is down and lightness handle is ' +
    'selected', async () => {
    const ref = createRef<ColorFieldRef>();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );
    fireEvent.mouseDown(container.querySelector('.lightness'), { button: 0 });
    expect(container).toMatchSnapshot('lightness handle moving');

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

      return Promise.resolve();
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
    expect(container).toMatchSnapshot('color selected');
    unmount();
  });

  it('should update values when mouse is down and hue handle is ' +
    'selected', async () => {
    const ref = createRef<ColorFieldRef>();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );

    fireEvent.mouseDown(container.querySelector('.hue'), { button: 0 });
    expect(container).toMatchSnapshot('hue handle moving');

    await act(async () => {
      window.pageXOffset = 50;
      Object.defineProperty(
        ref.current.colorHueRef.current,
        'offsetWidth',
        { value: 100 }
      );

      return Promise.resolve();
    });

    const moveEvent = createEvent
      .mouseMove(container.querySelector('.hue'));
    Object.defineProperty(moveEvent, 'pageX', { value: 100 });
    fireEvent(container.querySelector('.hue'), moveEvent);

    expect(container).toMatchSnapshot('color selected');
    unmount();
  });

  it('should update values when mouse is down and alpha handle is ' +
    'selected', async () => {
    const ref = createRef<ColorFieldRef>();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );

    fireEvent.mouseDown(container.querySelector('.alpha'), { button: 0 });
    expect(container).toMatchSnapshot('alpha handle moving');

    await act(async () => {
      window.pageXOffset = 50;
      Object.defineProperty(
        ref.current.colorAlphaRef.current,
        'offsetWidth',
        { value: 100 }
      );

      return Promise.resolve();
    });

    const moveEvent = createEvent
      .mouseMove(container.querySelector('.alpha'));
    Object.defineProperty(moveEvent, 'pageX', { value: 100 });
    fireEvent(container.querySelector('.alpha'), moveEvent);
    expect(container).toMatchSnapshot('color selected');

    unmount();
  });
});
