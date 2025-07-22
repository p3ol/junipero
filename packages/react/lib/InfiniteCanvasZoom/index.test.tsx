import { render } from '@testing-library/react';

import InfiniteCanvas from '../InfiniteCanvas';
import InfiniteCanvasZoom from '.';

describe('<InfiniteCanvasZoom />', () => {
  it('should render an infinite canvas zoom', () => {
    const { container, unmount } = render(
      <InfiniteCanvas
        overlay={(
          <div>
            <InfiniteCanvasZoom opened={true} />
          </div>
        )}
      >
        <div style={{ width: '1000px', height: '1000px' }}>Content</div>
      </InfiniteCanvas>
    );

    expect(container).toMatchSnapshot();
    unmount();
  });
});
