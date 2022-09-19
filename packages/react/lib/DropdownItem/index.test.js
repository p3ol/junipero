import { render } from '@testing-library/react';

import DropdownItem from './';

describe('<DropdownItem />', () => {
  it('should render', () => {
    const { container, unmount } = render(<DropdownItem />);
    expect(container.querySelectorAll('.junipero.dropdown-item').length)
      .toBe(1);
    unmount();
  });
});
