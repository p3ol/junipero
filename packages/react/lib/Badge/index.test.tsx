import { createRef } from 'react';
import { render } from '@testing-library/react';

import Badge, { BadgeRef } from './index';

describe('<Badge />', () => {
  it('should render', () => {
    const ref = createRef<BadgeRef>();
    const { unmount, container } = render(<Badge ref={ref}>1</Badge>);
    expect(container).toMatchSnapshot();
    expect(ref.current.isJunipero).toBe(true);
    expect(ref.current.innerRef.current).toBe(container.firstChild);
    unmount();
  });
});
