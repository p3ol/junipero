import { render, fireEvent } from '@testing-library/react';

import Button from './';

describe('<Button />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Button>Click me</Button>);
    expect(container.querySelectorAll('.junipero.button').length).toBe(1);
    unmount();
  });

  it('should fire onClick event when handler is passed with props', () => {
    const onClick = jest.fn();
    const { container, unmount } = render(
      <Button onClick={onClick}>Click me</Button>
    );
    fireEvent.click(container.querySelector('button'));
    expect(onClick).toHaveBeenCalled();
    unmount();
  });

  it('should not fire onClick event when button is disabled', () => {
    const onClick = jest.fn();
    const { container, unmount } = render(
      <Button disabled onClick={onClick}>Click me</Button>
    );
    fireEvent.click(container.querySelector('button'));
    expect(onClick).not.toHaveBeenCalled();
    unmount();
  });
});
