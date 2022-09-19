import { render, fireEvent } from '@testing-library/react';

import { DropdownContext } from '../contexts';
import DropdownToggle from './';

describe('<DropdownToggle />', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <DropdownContext.Provider value={{ disabled: false, toggle: () => {} }}>
        <DropdownToggle>Open me</DropdownToggle>
      </DropdownContext.Provider>
    );
    expect(container.querySelectorAll('.junipero.dropdown-toggle').length)
      .toBe(1);
    unmount();
  });

  it('should trigger dropdown toggle on click', () => {
    const toggle = jest.fn();
    const { container, unmount } = render(
      <DropdownContext.Provider value={{ disabled: false, toggle }}>
        <DropdownToggle>Open me</DropdownToggle>
      </DropdownContext.Provider>
    );
    fireEvent.click(container.querySelector('.junipero.dropdown-toggle'));
    expect(toggle).toHaveBeenCalled();
    unmount();
  });

  it('should not trigger dropdown toggle on click if dropdown is ' +
    'disabled', () => {
    const toggle = jest.fn();
    const { container, unmount } = render(
      <DropdownContext.Provider value={{ disabled: true, toggle }}>
        <DropdownToggle>Open me</DropdownToggle>
      </DropdownContext.Provider>
    );
    fireEvent.click(container.querySelector('.junipero.dropdown-toggle'));
    expect(toggle).not.toHaveBeenCalled();
    unmount();
  });
});
