import React, { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react';

import Tooltip from './';

describe('<Tooltip />', () => {
  it('should render', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <Tooltip ref={ref}>
        <span>Text</span>
      </Tooltip>
    );
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(1);
    expect(ref.current.opened).toBe(true);
    fireEvent.mouseLeave(container.querySelector('span'));
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(0);
    expect(ref.current.opened).toBe(false);
    unmount();
  });

  it('should also render tooltip when using click as trigger', () => {
    const { container, unmount } = render(
      <Tooltip trigger="click">
        Text
      </Tooltip>
    );

    fireEvent.click(container.querySelector('span'));
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(1);
    fireEvent.click(document.body);
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(0);
    unmount();
  });

  it('should render even with no children', () => {
    const { container, unmount } = render(<Tooltip />);
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(1);
    unmount();
  });

  it('should render with a custom placement', () => {
    const { container, unmount } = render(
      <Tooltip placement="bottom-end" />
    );
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(1);
    unmount();
  });

  it('should automatically close tooltip when disabled prop changes', () => {
    const { container, rerender, unmount } = render(<Tooltip>Text</Tooltip>);
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(1);
    rerender(<Tooltip disabled>Text</Tooltip>);
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(0);
    unmount();
  });

  it('should allow to click outside without trying to close tooltip', () => {
    const { container, unmount } = render(
      <Tooltip trigger="click">
        Text
      </Tooltip>
    );
    fireEvent.click(document.body);
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(0);
    unmount();
  });

  it('shouldn\'t open tooltip if disabled', () => {
    const { container, unmount } = render(
      <Tooltip disabled={true}>
        Text
      </Tooltip>
    );
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(0);
    unmount();
  });

  it('should be able render inside another container using portals', () => {
    const { unmount: unmountContainer } = render(
      <div className="test-container" />
    );

    const { container, unmount } = render(
      <Tooltip container=".test-container" />
    );
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(document.querySelector('.test-container .junipero.tooltip'))
      .not.toBeFalsy();
    unmountContainer();
    unmount();
  });

  it('should animate tooltip if prop is provided', () => {
    const animate = jest.fn(tooltip => tooltip);

    const { container, unmount } = render(
      <Tooltip animate={animate} />
    );
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(animate).toHaveBeenCalled();
    unmount();
  });

  it('should animate tooltip in custom container if prop is provided', () => {
    const animate = jest.fn(tooltip => tooltip);
    const { unmount: unmountContainer } = render(
      <div className="test-container" />
    );

    const { container, unmount } = render(
      <Tooltip container=".test-container" animate={animate} />
    );
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(animate).toHaveBeenCalled();
    unmountContainer();
    unmount();
  });

  it('should allow to define a custom target to check for a click outside ' +
    'event', async () => {
    const ref = createRef();
    const buttonRef = createRef();
    const linkRef = createRef();

    const { unmount: unmountLink } = render(
      <a ref={linkRef} className="link" />
    );

    const { container, getByText, unmount } = render(
      <div>
        <button className="button" ref={buttonRef} />
        <Tooltip
          trigger="click"
          ref={ref}
          clickOutsideTarget={linkRef.current}
        >
          Text
        </Tooltip>
      </div>
    );

    fireEvent.click(getByText('Text'));
    expect(ref.current.opened).toBe(true);
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(1);
    expect(linkRef.current).toBeDefined();
    fireEvent.click(linkRef.current);
    expect(ref.current.opened).toBe(true);
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(1);
    fireEvent.click(buttonRef.current);
    expect(ref.current.opened).toBe(false);
    expect(container.querySelectorAll('.junipero.tooltip').length).toBe(0);
    unmountLink();
    unmount();
  });
});
