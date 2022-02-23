import React from 'react';
import { render } from '@testing-library/react';

import Tag from './';

describe('<Tag />', () => {
  it('should render tag component', () => {
    const { container, unmount } = render(<Tag>1</Tag>);
    expect(container.querySelectorAll('.junipero.tag').length).toBe(1);
    unmount();
  });
});
