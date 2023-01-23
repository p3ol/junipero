import { useState } from 'react';
import { fireEvent, render, act } from '@testing-library/react';

import Transition from '.';

describe('<Transition />', () => {
  it('should render correctly', () => {
    jest.useFakeTimers();

    const Comp = () => {
      const [enabled, setEnabled] = useState(false);

      return (
        <>
          <button onClick={() => setEnabled(e => !e)}>Toggle</button>
          <Transition in={enabled} timeout={100}>
            <div>Animated text</div>
          </Transition>
        </>
      );
    };

    const { container, unmount } = render(<Comp />);
    expect(container).toMatchSnapshot('Idle');
    fireEvent.click(container.querySelector('button'));
    act(() => { jest.advanceTimersByTime(50); });
    expect(container).toMatchSnapshot('Active');
    act(() => { jest.advanceTimersByTime(100); });
    expect(container).toMatchSnapshot('Done');
    unmount();
  });
});
