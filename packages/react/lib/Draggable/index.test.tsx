import { fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';

import { sleep } from '../../tests/utils';
import Draggable from './index';

describe('<Draggable />', () => {
  it('should render', async () => {
    const { container, unmount } = render(<Draggable><p>hello</p></Draggable>);
    expect(container).toMatchSnapshot('default');
    fireEvent.dragStart(container.querySelector('p'));
    expect(container).toMatchSnapshot('dragging');
    await sleep(1);
    expect(container).toMatchSnapshot('dragged');
    fireEvent.dragEnd(container.querySelector('p'));
    expect(container).toMatchSnapshot('default again');
    unmount();
  });

  it('should trigger onDragStart props when drag start', () => {
    const onDragStart = vi.fn();
    const onDrag = vi.fn();
    const onDragEnd = vi.fn();
    const { container, unmount } = render(
      <Draggable
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <p>hello</p>
      </Draggable>
    );

    fireEvent.dragStart(container.querySelector('p'));
    expect(onDragStart).toHaveBeenCalled();
    fireEvent.drag(container.querySelector('p'));
    expect(onDrag).toHaveBeenCalled();
    fireEvent.dragEnd(container.querySelector('p'));
    expect(onDragEnd).toHaveBeenCalled();
    unmount();
  });

  it('should not trigger anything when disabled', () => {
    const onDragStart = vi.fn();
    const onDrag = vi.fn();
    const onDragEnd = vi.fn();
    const { container, unmount } = render(
      <Draggable
        disabled={true}
        onDrag={onDrag}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <p>hello</p>
      </Draggable>
    );

    fireEvent.dragStart(container.querySelector('p'));
    expect(onDragStart).not.toHaveBeenCalled();
    expect(container).toMatchSnapshot('dragging');
    fireEvent.drag(container.querySelector('p'));
    expect(onDrag).not.toHaveBeenCalled();
    fireEvent.dragEnd(container.querySelector('p'));
    expect(onDragEnd).not.toHaveBeenCalled();
    unmount();
  });
});
