import { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { classNames } from '@poool/junipero-utils';

import { useEventListener, useTimeout, useInterval } from './';

/* eslint-disable react/prop-types */
const TestComponent = ({ target, onTimeout, onInterval }) => {
  const [clicked, setClicked] = useState(false);

  useEventListener('click', () => {
    setClicked(true);
  }, target);

  onInterval && useInterval(() => onInterval(), 500, []);

  onTimeout && useTimeout(() => {
    onTimeout();
  }, 500);

  return <div className={classNames({ clicked })} />;
};
/* eslint-enable react/prop-types */

describe('useEventListener(name, listener, target)', () => {
  it('should allow to use global event listeners', () => {
    const { container, unmount } = render(<TestComponent />);
    expect(container.querySelectorAll('.clicked').length).toBe(0);
    fireEvent.click(document.body);
    expect(container.querySelectorAll('.clicked').length).toBe(1);
    unmount();
  });

  it('should allow to use any event target', () => {
    const target = {};
    const { container, unmount } = render(<TestComponent target={target} />);
    expect(container.querySelectorAll('.clicked').length).toBe(0);
    unmount();
  });
});

describe('useInterval(cb, time, changes)', () => {
  it('should execute task each given amount of ms', async () => {
    jest.useFakeTimers();
    const onInterval = jest.fn();
    const { unmount } = render(<TestComponent onInterval={onInterval} />);
    jest.advanceTimersByTime(2000);
    expect(onInterval).toHaveBeenCalledTimes(4);
    unmount();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
});

describe('useTimeout(listener, time, changes)', () => {
  it('should allow to execute a task after a given amount of ms', () => {
    jest.useFakeTimers();
    const onTimeout = jest.fn();
    const { unmount } = render(<TestComponent onTimeout={onTimeout} />);
    jest.runAllTimers();
    expect(onTimeout).toHaveBeenCalled();
    unmount();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
});
