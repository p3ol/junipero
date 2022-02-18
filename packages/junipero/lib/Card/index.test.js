import React from 'react';
import { render } from '@testing-library/react';

import Card from './';

describe('<Card />', () => {
  it('should render Card component and it child', () => {
    const { container, unmount } = render(
      <Card><div className="test" /></Card>
    );
    expect(container.querySelectorAll('.junipero.card').length).toBe(1);
    expect(container.querySelectorAll('.test').length).toBe(1);
    unmount();
  });
});
