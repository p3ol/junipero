import { render, fireEvent } from '@testing-library/react';

import Alert from './';

describe('<Alert />', () => {
  it('should render Alert box', () => {
    const { container, unmount } = render(<Alert icon="🐱" />);
    expect(container.querySelectorAll('.junipero.alert').length).toBe(1);
    unmount();
  });

  it('should be able to trigger onClose', () => {
    const onClose = jest.fn();
    const { container, unmount } = render(<Alert onClose={onClose} />);
    fireEvent.click(container.querySelector('.close'));
    expect(onClose).toHaveBeenCalled();
    unmount();
  });

  it('should be able to trigger onClick', () => {
    const onClick = jest.fn();
    const { container, unmount } = render(<Alert onClick={onClick} />);
    fireEvent.click(container.querySelector('.junipero.alert'));
    expect(onClick).toHaveBeenCalled();
    unmount();
  });
});
