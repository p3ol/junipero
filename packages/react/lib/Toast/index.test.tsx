import { render, act, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import ToastsControl from '../ToastsControl';
import Toasts from '../Toasts';
import Toast, { type ToastObject } from './index';

describe('<Toast />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Toast>Content</Toast>);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should be auto dismissable', async () => {
    vi.useFakeTimers();
    const toast: ToastObject = { index: 1, content: 'Content', lifespan: 100 };
    const { container, unmount } = render(
      <ToastsControl toasts={[toast]}>
        <Toasts />
      </ToastsControl>
    );
    expect(container).toMatchSnapshot();

    await act(async () => Promise.resolve(vi.advanceTimersByTime(100)));
    await act(async () => Promise.resolve(vi.advanceTimersByTime(1)));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should be manually dismissable', () => {
    const toast: ToastObject = { index: 1, content: 'Content', lifespan: 100 };
    const { container, unmount } = render(
      <ToastsControl toasts={[toast]}>
        <Toasts />
      </ToastsControl>
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(container.querySelector('.toast'));

    expect(container).toMatchSnapshot();

    unmount();
  });
});
