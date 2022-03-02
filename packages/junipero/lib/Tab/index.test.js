import React from 'react';
import { render } from '@testing-library/react';

import Tab from './';

describe('<Tab />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Tab />);
    expect(container.querySelectorAll('.junipero.tab').length).toBe(1);
    unmount();
  });
});
