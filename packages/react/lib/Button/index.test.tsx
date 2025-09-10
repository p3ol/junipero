import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import Button from './';

describe('<Button />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Button>Click me</Button>);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should fire onClick event', () => {
    const onClick = vi.fn();
    const { container, unmount } = render(
      <Button onClick={onClick}>Click me</Button>
    );
    fireEvent.click(container.querySelector('button'));
    expect(onClick).toHaveBeenCalled();
    unmount();
  });

  it('should not fire onClick event when button is disabled', () => {
    const onClick = vi.fn();
    const { container, unmount } = render(
      <Button tag="a" disabled onClick={onClick}>Click me</Button>
    );
    fireEvent.click(container.querySelector('a'));
    expect(onClick).not.toHaveBeenCalled();
    unmount();
  });
});
