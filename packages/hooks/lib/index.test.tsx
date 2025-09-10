import { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { classNames } from '@junipero/core';

import {
  useEventListener,
  useTimeout,
  useInterval,
  useEffectAfterMount,
  useLayoutEffectAfterMount,
} from '.';

const TestComponent = (
  { target, onTimeout, onInterval }:
  { target?: any, onTimeout?: any, onInterval?: any}
) => {
  const [clicked, setClicked] = useState(false);

  useEventListener('click', () => {
    setClicked(true);
  }, [], { target });

  if (onInterval) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useInterval(() => onInterval(), 500, []);
  }

  if (onTimeout) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTimeout(() => {
      onTimeout();
    }, 500);
  }

  return <div className={classNames({ clicked })} />;
};

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
  it('should execute task each given amount of ms', () => {
    vi.useFakeTimers();
    const onInterval = vi.fn();
    const { unmount } = render(<TestComponent onInterval={onInterval} />);
    vi.advanceTimersByTime(2000);
    expect(onInterval).toHaveBeenCalledTimes(4);
    unmount();
    vi.clearAllTimers();
    vi.useRealTimers();
  });
});

describe('useTimeout(listener, time, changes)', () => {
  it('should allow to execute a task after a given amount of ms', () => {
    vi.useFakeTimers();
    const onTimeout = vi.fn();
    const { unmount } = render(<TestComponent onTimeout={onTimeout} />);
    vi.runAllTimers();
    expect(onTimeout).toHaveBeenCalled();
    unmount();
    vi.clearAllTimers();
    vi.useRealTimers();
  });
});

const EffectsTestComponent = (
  { enabled, onEffect, onLayoutEffect }:
  { enabled?: boolean, onEffect?: ()=> void, onLayoutEffect?: ()=> void}
): null => {
  if (onEffect) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffectAfterMount(() => {
      onEffect();
    }, [enabled]);
  }

  if (onLayoutEffect) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffectAfterMount(() => {
      onLayoutEffect();
    }, [enabled]);
  }

  return null;
};

describe('useEffectAfterMount(cb, changes)', () => {
  it('should execute task after mount', () => {
    const onEffect = vi.fn();
    const { unmount, rerender } = render(
      <EffectsTestComponent enabled={false} onEffect={onEffect} />
    );
    rerender(<EffectsTestComponent enabled={true} onEffect={onEffect} />);
    expect(onEffect).toHaveBeenCalledTimes(1);
    unmount();
  });
});

describe('useLayoutEffectAfterMount(cb, changes)', () => {
  it('should execute task after mount', () => {
    const onLayoutEffect = vi.fn();
    const { unmount, rerender } = render(
      <EffectsTestComponent enabled={false} onLayoutEffect={onLayoutEffect} />
    );
    rerender(
      <EffectsTestComponent enabled={true} onLayoutEffect={onLayoutEffect} />
    );
    expect(onLayoutEffect).toHaveBeenCalledTimes(1);
    unmount();
  });
});
