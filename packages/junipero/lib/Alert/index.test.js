import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Alert from './';

describe('<Alert />', () => {
  it('should render Alert box', () => {
    const { container } = render(<Alert icon="🐱" />);
    expect(container.querySelectorAll('.junipero.alert').length).toBe(1);
  });

  it('should be able to trigger onClose', () => {
    const onClose = jest.fn();
    const { container } = render(<Alert onClose={onClose} />);
    fireEvent.click(container.querySelector('.close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should be able to trigger onClick', () => {
    const onClick = jest.fn();
    const { container } = render(<Alert onClick={onClick} />);
    fireEvent.click(container.querySelector('.junipero.alert'));
    expect(onClick).toHaveBeenCalled();
  });
});
