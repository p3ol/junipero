import React from 'react';
import { render } from '@testing-library/react';

import Badge from './';

describe('<Badge />', () => {
  it('should render a basic badge', () => {
    const { container } = render(<Badge>1</Badge>);
    expect(container.querySelectorAll('.junipero.badge').length).toBe(1);
  });
});
