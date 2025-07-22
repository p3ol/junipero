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
});
