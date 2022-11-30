import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TouchableZone from '.';

describe('<TouchableZone />', () => {
  it('should display', () => {
    const { container, unmount } = render(<TouchableZone />);
    expect(container.querySelector('.touchable-zone')).toBeTruthy();
    unmount();
  });

  it('should trigger onClick event on click', async () => {
    const user = userEvent.setup();
    const onClickMock = jest.fn();
    const { container, unmount } = render(
      <TouchableZone onClick={onClickMock} />
    );

    await user.click(container.querySelector('.touchable-zone'));

    expect(onClickMock).toHaveBeenCalled();
    unmount();
  });

  it('should render children', () => {
    const { container, unmount } = render(
      <TouchableZone>
        <div className="subContent">
          sub content
        </div>
      </TouchableZone>
    );
    expect(container.querySelector('.subContent')).toBeTruthy();
    unmount();
  });
});
