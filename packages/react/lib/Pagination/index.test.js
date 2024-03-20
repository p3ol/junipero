import { render, fireEvent } from '@testing-library/react';

import Pagination from '.';

describe('<Pagination />', () => {
  it('should render using props', () => {
    const { container, unmount } = render(
      <Pagination size={7} initialPage={3} onPageChange={() => {}} />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render using props', () => {
    const { container, unmount } = render(
      <Pagination
        size={10}
        initialPage={6}
        onPageChange={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render using props', () => {
    const { container, unmount } = render(
      <Pagination
        size={12}
        shouldWrap={false}
        onPageChange={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render using props', () => {
    const { container, unmount } = render(
      <Pagination
        size={12}
        shouldWrapFrom={10}
        onPageChange={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render using props', () => {
    const { container, unmount } = render(
      <Pagination
        size={10}
        initialPage={10}
        onPageChange={() => {}}
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should fire onPageChange event', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination size={7} onPageChange={onPageChange} />
    );
    fireEvent.click(container.querySelector('.next'));
    expect(onPageChange).toHaveBeenCalled();
    unmount();
  });

  it('should fire onPageChange event on a basic configuration', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination size={7} onPageChange={onPageChange} />
    );
    fireEvent.click(container.querySelectorAll('.pagination-item')[2]);
    expect(onPageChange).toHaveBeenCalled();
    unmount();
  });

  it('should fire onPageChange event on a wrapped configuration', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination size={10} onPageChange={onPageChange} />
    );
    fireEvent.click(container.querySelectorAll('.pagination-item')[1]);
    fireEvent.click(container.querySelectorAll('.pagination-item')[6]);
    expect(onPageChange).toHaveBeenCalledTimes(2);
    unmount();
  });

  it('should fire onPageChange event when clicking previous button and' +
  'active page is greater than 1', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination size={7} initialPage={3} onPageChange={onPageChange} />
    );
    fireEvent.click(container.querySelector('.previous'));
    expect(onPageChange).toHaveBeenCalled();
    unmount();
  });

  it('should not fire onPageChange event when clicking previous button and' +
  'active page is 1', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination size={7} onPageChange={onPageChange} />
    );
    fireEvent.click(container.querySelector('.previous-disabled'));
    expect(onPageChange).not.toHaveBeenCalled();
    unmount();
  });

  it('should not fire onPageChange event when clicking next button and' +
  'active page is the last', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination size={7} initialPage={7} onPageChange={onPageChange} />
    );
    fireEvent.click(container.querySelector('.next-disabled'));
    expect(onPageChange).not.toHaveBeenCalled();
    unmount();
  });
});
