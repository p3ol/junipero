import { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';

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
    expect(container).toMatchSnapshot();
    fireEvent.click(container.querySelector('button'));
    jest.advanceTimersByTime(100);
    expect(container).toMatchSnapshot();
    unmount();
  });
});
