import { useState } from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { vi } from 'vitest';

import Transition from '.';

describe('<Transition />', () => {
  it('should render correctly', () => {
    vi.useFakeTimers();

    const events = {
      onEnter: vi.fn(),
      onEntering: vi.fn(),
      onEntered: vi.fn(),
      onExit: vi.fn(),
      onExiting: vi.fn(),
      onExited: vi.fn(),
    };

    const Comp = () => {
      const [enabled, setEnabled] = useState(false);

      return (
        <>
          <button onClick={() => setEnabled(e => !e)}>Toggle</button>
          <Transition
            in={enabled}
            timeout={100}
            { ...events }
          >
            <div>Animated text</div>
          </Transition>
        </>
      );
    };

    const { container, unmount } = render(<Comp />);
    expect(container).toMatchSnapshot('Idle');

    // Enter
    fireEvent.click(container.querySelector('button'));
    expect(events.onEnter).toHaveBeenCalledTimes(1);
    act(() => { vi.advanceTimersByTime(50); });
    expect(events.onEntering).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot('Active');
    act(() => { vi.advanceTimersByTime(100); });
    expect(events.onEntered).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot('Done');

    // Exit
    fireEvent.click(container.querySelector('button'));
    expect(events.onExit).toHaveBeenCalledTimes(1);
    act(() => { vi.advanceTimersByTime(50); });
    expect(events.onExiting).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot('Active');
    act(() => { vi.advanceTimersByTime(100); });
    expect(events.onExited).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot('Done');
    unmount();
  });
});
