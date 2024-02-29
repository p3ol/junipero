import { render, act } from '@testing-library/react';

import AlertsControl from '../AlertsControl';
import Alerts from '../Alerts';
import Alert from './index';

describe('<Alert />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Alert title="Title">Content</Alert>);
    expect(container);
    unmount();
  });

  it('should be auto dismissable', async () => {
    jest.useFakeTimers();
    const alert = { id: 1, title: 'Title', content: 'Content', lifespan: 100 };
    const { container, unmount } = render(
      <AlertsControl alerts={[alert]}>
        <Alerts />
      </AlertsControl>
    );
    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(100));
    await act(async () => jest.advanceTimersByTime(1));
    expect(container).toMatchSnapshot();

    unmount();
  });
});
