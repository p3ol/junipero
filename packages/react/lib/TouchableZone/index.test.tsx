import { render } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import TouchableZone from '.';

describe('<TouchableZone />', () => {
  it('should display', () => {
    const { container, unmount } = render(<TouchableZone />);
    expect(container.querySelector('.touchable-zone')).toBeTruthy();
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should trigger onClick event on click', async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();
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
    expect(container).toMatchSnapshot();
    unmount();
  });
});
