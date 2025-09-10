import { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { appearBounceModal } from '@junipero/transitions';

import Modal, { type ModalRef } from '.';

describe('<Modal />', () => {
  it('should render', () => {
    const ref = createRef<ModalRef>();
    const { container, unmount } = render(
      <div className="container">
        <Modal opened={true} container=".container" ref={ref} />
      </div>
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should remove modal from DOM when using close method', async () => {
    const ref = createRef<ModalRef>();
    const { container, unmount } = render(<Modal ref={ref} />);
    await act(async () => Promise.resolve(ref.current.open()));
    expect(container).toMatchSnapshot('opened');
    await act(async () => Promise.resolve(ref.current.close()));
    expect(container).toMatchSnapshot('closed');
    unmount();
  });

  it('should not toggle modal if it is disabled', async () => {
    const ref = createRef<ModalRef>();
    const { container, unmount } = render(
      <Modal ref={ref} disabled={true} />
    );
    await act(async () => Promise.resolve(ref.current.open()));
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should close modal when clicking on backdrop', async () => {
    const ref = createRef<ModalRef>();
    const { container, unmount } = render(
      <div className="container">
        <Modal container=".container" ref={ref} />
      </div>
    );
    await act(async () => Promise.resolve(ref.current.open()));
    expect(container).toMatchSnapshot('opened');
    fireEvent.click(container.querySelector('.wrapper'));
    expect(container).toMatchSnapshot('closed');
    unmount();
  });

  it('should not close modal if clicked inside', async () => {
    const ref = createRef<ModalRef>();
    const { container, unmount } = render(
      <div className="container">
        <Modal container=".container" ref={ref} />
      </div>
    );
    await act(async () => Promise.resolve(ref.current.open()));
    expect(container).toMatchSnapshot();
    fireEvent.click(container.querySelector('.content'));
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should not close modal closable = false', async () => {
    const ref = createRef<ModalRef>();
    const { container, unmount } = render(
      <div className="container">
        <Modal container=".container" closable={false} ref={ref} />
      </div>
    );
    await act(async () => Promise.resolve(ref.current.open()));
    expect(container).toMatchSnapshot();
    fireEvent.click(container.querySelector('.wrapper'));
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to animate modal', () => {
    vi.useFakeTimers();
    const ref = createRef<ModalRef>();
    const { container, unmount } = render(
      <div className="container">
        <Modal animate={appearBounceModal} ref={ref} />
      </div>
    );
    act(() => {
      ref.current.open();
      vi.advanceTimersByTime(100);
    });
    expect(container).toMatchSnapshot('opened');
    act(() => {
      ref.current.close();
      vi.advanceTimersByTime(100);
    });
    expect(container).toMatchSnapshot('closed');

    vi.useRealTimers();
    unmount();
  });
});
