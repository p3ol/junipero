import { render } from '@testing-library/react';

import Loader from './';

describe('<Loader />', () => {
  it('should render dots', () => {
    const { container, unmount } = render(<Loader />);
    expect(container.querySelectorAll('.junipero.loader.dots').length).toBe(1);
    expect(container.querySelectorAll('.dot').length).toBe(3);
    expect(container.querySelectorAll('.inner').length).toBe(0);
    unmount();
  });

  it('should render bars', () => {
    const { container, unmount } = render(<Loader type="bar" />);
    expect(container.querySelectorAll('.junipero.loader.bar').length).toBe(1);
    expect(container.querySelectorAll('.dot').length).toBe(0);
    expect(container.querySelectorAll('.inner').length).toBe(1);
    unmount();
  });

  it('should render spinner', () => {
    const { container, unmount } = render(<Loader type="spinner" />);
    expect(container.querySelectorAll('.junipero.loader.spinner').length)
      .toBe(1);
    expect(container.querySelectorAll('.dot').length).toBe(0);
    expect(container.querySelectorAll('.inner').length).toBe(0);
    unmount();
  });
});
