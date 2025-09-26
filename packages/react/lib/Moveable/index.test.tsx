import { fireEvent, render } from '@testing-library/react';

import Moveable from '.';

describe('<Moveable />', () => {
  it('should render a moveable', () => {
    const { container, unmount } = render(
      <Moveable>
        <div style={{ width: '1000px', height: '1000px' }}>Content</div>
      </Moveable>
    );

    expect(container).toMatchSnapshot();
    fireEvent.mouseDown(container.querySelector('.moveable'), { button: 0 });

    expect(container).toMatchSnapshot('moving');

    fireEvent.mouseMove(container.querySelector('.moveable'), {
      clientX: 100,
      clientY: 100,
    });
    fireEvent.mouseUp(container.querySelector('.moveable'), {
      clientX: 100,
      clientY: 100,
    });
    expect(container).toMatchSnapshot('moveable moved');
    unmount();
  });

  it('should not move when disabled', () => {
    const { container, unmount } = render(
      <Moveable disabled>
        <div style={{ width: '1000px', height: '1000px' }}>Content</div>
      </Moveable>
    );

    expect(container).toMatchSnapshot();
    fireEvent.mouseDown(container.querySelector('.moveable'), { button: 0 });

    expect(container).toMatchSnapshot('not moving');

    fireEvent.mouseMove(container.querySelector('.moveable'), {
      clientX: 100,
      clientY: 100,
    });
    fireEvent.mouseUp(container.querySelector('.moveable'), {
      clientX: 100,
      clientY: 100,
    });
    expect(container).toMatchSnapshot('still not moving');
    unmount();
  });

  it('should move on a grid', () => {
    const { container, unmount } = render(
      <Moveable step={50}>
        <div style={{ width: '1000px', height: '1000px' }}>Content</div>
      </Moveable>
    );

    expect(container).toMatchSnapshot();
    fireEvent.mouseDown(container.querySelector('.moveable'), { button: 0 });

    expect(container).toMatchSnapshot('moving');

    fireEvent.mouseMove(container.querySelector('.moveable'), {
      clientX: 80,
      clientY: 80,
    });
    fireEvent.mouseUp(container.querySelector('.moveable'), {
      clientX: 80,
      clientY: 80,
    });
    expect(container).toMatchSnapshot('moveable moved to 100,100');
    unmount();
  });
});
