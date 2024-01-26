import { render, fireEvent } from '@testing-library/react';

import Pagination from '.';

describe('<Pagination />', () => {
  it('should render using props', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination size={7} initialPage={3} onPageChange={onPageChange} />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render using props', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination
        size={10}
        initialPage={6}
        onPageChange={onPageChange}
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render using props', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination
        size={12}
        shouldWrap={false}
        onPageChange={onPageChange}
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render using props', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination
        size={12}
        shouldWrapFrom={10}
        onPageChange={onPageChange}
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render using props', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination
        size={10}
        initialPage={10}
        onPageChange={onPageChange}
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

  it('should fire onPageChange event', () => {
    const onPageChange = jest.fn();
    const { container, unmount } = render(
      <Pagination size={7} onPageChange={onPageChange} />
    );
    fireEvent.click(container.querySelectorAll('.pagination-item')[2]);
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
