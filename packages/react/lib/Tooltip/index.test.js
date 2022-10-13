import { act, render, fireEvent } from '@testing-library/react';

import Tooltip from './';

describe('<Tooltip />', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <Tooltip text="Bar"><span>Foo</span></Tooltip>
    );

    expect(container).toMatchSnapshot();
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(container).toMatchSnapshot();
    fireEvent.mouseLeave(container.querySelector('span'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should also render tooltip when using click as trigger', async () => {
    const { container, unmount } = render(
      <Tooltip text="Bar" trigger="click">Foo</Tooltip>
    );

    expect(container).toMatchSnapshot();
    fireEvent.click(container.querySelector('span'));
    expect(container).toMatchSnapshot();
    fireEvent.click(container.querySelector('span'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should automatically close tooltip when disabled prop changes', () => {
    const { container, rerender, unmount } = render(
      <Tooltip text="Bar">Foo</Tooltip>
    );
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(container).toMatchSnapshot();
    rerender(<Tooltip disabled text="Bar">Foo</Tooltip>);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('shouldn\'t open tooltip if disabled', () => {
    const { container, unmount } = render(
      <Tooltip text="Bar" disabled>
        Foo
      </Tooltip>
    );
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should be able render inside another container using portals', () => {
    const { container: target, unmount: unmountContainer } = render(
      <div className="test-container" />
    );

    const { container, unmount } = render(
      <Tooltip text="Bar" container=".test-container">Foo</Tooltip>
    );
    fireEvent.mouseEnter(container.querySelector('span'));
    expect(target).toMatchSnapshot();
    unmountContainer();
    unmount();
  });
});
