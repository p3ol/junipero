import { render, act } from '@testing-library/react';

import AlertsControl from '../AlertsControl';
import Alerts from '../Alerts';
import Alert from './index';

describe('<Alert />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Alert title="Title">Content</Alert>);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should be auto dismissable', async () => {
    jest.useFakeTimers();
    const { container, unmount } = render(
      <AlertsControl
        alerts={[{ title: 'Title', content: 'Content', lifespan: 100 }]}
      >
        <Alerts />
      </AlertsControl>
    );
    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(100));
    expect(container).toMatchSnapshot();

    unmount();
  });
});
