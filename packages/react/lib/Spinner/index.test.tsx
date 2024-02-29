import { render } from '@testing-library/react';

import Spinner from './index';

describe('<Spinner />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Spinner />);
    expect(container).toMatchSnapshot();
    unmount();
  });
});
