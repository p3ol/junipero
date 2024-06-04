import { render } from '@testing-library/react';

import Card from './index';

describe('<Card />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Card />);
    expect(container).toMatchSnapshot();
    unmount();
  });
});
