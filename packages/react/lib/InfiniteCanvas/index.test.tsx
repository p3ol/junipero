import { render } from '@testing-library/react';

import InfiniteCanvas from '.';

describe('<InfiniteCanvas />', () => {
  it('should render an infinite canvas', () => {
    const { container, unmount } = render(
      <InfiniteCanvas>
        <div style={{ width: '1000px', height: '1000px' }}>Content</div>
      </InfiniteCanvas>
    );

    expect(container).toMatchSnapshot();
    unmount();
  });
});
