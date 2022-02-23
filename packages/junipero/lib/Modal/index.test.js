import { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import Modal from './';

describe('<Modal />', () => {
  it('should render', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <div className="container">
        <Modal opened={true} container=".container" ref={ref} />
      </div>
    );
    expect(container.querySelectorAll('.junipero.modal').length).toBe(1);
    unmount();
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <div className="container">
        <Modal opened={true} ref={ref} container=".container" />
      </div>
    );
    expect(ref.current.innerRef).toBeDefined();
    expect(container.querySelector('.junipero.modal'))
      .toBe(ref.current.innerRef.current);
    unmount();
  });

  it('should remove modal from DOM when using close method', async () => {
    const ref = createRef();
    const { unmount } = render(<Modal ref={ref} />);
    await act(async () => { ref.current.open(); });
    expect(ref.current.innerRef.current).toBeTruthy();
    await act(async () => { ref.current.close(); });
    expect(ref.current.innerRef.current).toBeFalsy();
    await act(async () => { ref.current.toggle(); });
    expect(ref.current.innerRef.current).toBeTruthy();
    unmount();
  });

  it('should not toggle modal if it is disabled', async () => {
    const ref = createRef();
    const { rerender, unmount } = render(
      <Modal ref={ref} disabled={true} />
    );
    await act(async () => { ref.current.open(); });
    expect(ref.current.innerRef.current).toBeFalsy();
    rerender(<Modal ref={ref} disabled={true} opened={true} />);
    expect(ref.current.innerRef.current).toBeTruthy();
    await act(async () => { ref.current.close(); });
    expect(ref.current.innerRef.current).toBeTruthy();
    await act(async () => { ref.current.toggle(); });
    expect(ref.current.innerRef.current).toBeTruthy();
    unmount();
  });

  it('should close modal when clicking on backdrop', async () => {
    const ref = createRef();
    const { container, unmount } = render(
      <div className="container">
        <Modal container=".container" ref={ref} />
      </div>
    );
    await act(async () => { ref.current.open(); });
    expect(ref.current.innerRef.current).toBeTruthy();
    fireEvent.click(container.querySelector('.wrapper'));
    expect(ref.current.innerRef.current).toBeFalsy();
    unmount();
  });

  it('should not close modal if clicked inside', async () => {
    const ref = createRef();
    const { container, unmount } = render(
      <div className="container">
        <Modal container=".container" ref={ref} />
      </div>
    );
    await act(async () => { ref.current.open(); });
    expect(ref.current.innerRef.current).toBeTruthy();
    fireEvent.click(container.querySelector('.content'));
    expect(ref.current.innerRef.current).toBeTruthy();
    unmount();
  });

  it('should not close modal closable = false', async () => {
    const ref = createRef();
    const { container, unmount } = render(
      <div className="container">
        <Modal container=".container" closable={false} ref={ref} />
      </div>
    );
    await act(async () => { ref.current.open(); });
    expect(ref.current.innerRef.current).toBeTruthy();
    fireEvent.click(container.querySelector('.wrapper'));
    expect(ref.current.innerRef.current).toBeTruthy();
    unmount();
  });

  it('should animate modal if animate prop is provided', async () => {
    const ref = createRef();
    const animate = jest.fn(modal => modal);
    const { unmount } = render(<Modal ref={ref} animate={animate} />);
    await act(async () => { ref.current.open(); });
    expect(animate).toHaveBeenCalled();
    unmount();
  });
});
