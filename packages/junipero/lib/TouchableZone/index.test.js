import React from 'react';
import { render } from '@testing-library/react';

import TouchableZone from './';

describe('<TouchableZone />', () => {
  it('should render TouchableZone component and its childs', () => {
    const { container, unmount } = render(
      <TouchableZone><span className="test">Test</span></TouchableZone>
    );
    expect(container.querySelectorAll('.junipero.touchable-zone').length)
      .toBe(1);
    expect(container.querySelectorAll('.test').length).toBe(1);
    unmount();
  });
});
