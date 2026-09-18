import { createEvent, fireEvent, render } from '@testing-library/react';
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

  it('should not add dragging & dragged classes if event is prevented', async () => {
    const { container, rerender, unmount } = render(<Draggable><p>hello</p></Draggable>);
    let p = container.querySelector('p');

    // Natively prevented
    fireEvent(p, createEvent('dragStart', p, { defaultPrevented: true }));
    expect(container.querySelector('p')?.classList.contains('dragging')).toBe(false);
    await sleep(1);
    expect(container.querySelector('p')?.classList.contains('dragged')).toBe(false);
    fireEvent.dragEnd(p);
    expect(container.querySelector('p')?.classList.contains('dragging')).toBe(false);
    await sleep(1);
    expect(container.querySelector('p')?.classList.contains('dragged')).toBe(false);

    fireEvent.dragStart(p);
    expect(container.querySelector('p')?.classList.contains('dragging')).toBe(true);
    await sleep(1);
    expect(container.querySelector('p')?.classList.contains('dragged')).toBe(true);
    fireEvent.dragEnd(p);
    expect(container.querySelector('p')?.classList.contains('dragging')).toBe(false);
    await sleep(1);
    expect(container.querySelector('p')?.classList.contains('dragged')).toBe(false);

    fireEvent.dragStart(p);
    expect(container.querySelector('p')?.classList.contains('dragging')).toBe(true);
    await sleep(1);
    expect(container.querySelector('p')?.classList.contains('dragged')).toBe(true);
    fireEvent(p, createEvent('dragEnd', p, { defaultPrevented: true }));
    expect(container.querySelector('p')?.classList.contains('dragging')).toBe(false);
    await sleep(1);
    expect(container.querySelector('p')?.classList.contains('dragged')).toBe(true);
    fireEvent.dragEnd(p);

    // Prevented on props level
    rerender(
      <Draggable
        onDragStart={e => e.preventDefault()}
      >
        <p>hello</p>
      </Draggable>
    );

    p = container.querySelector('p');
    fireEvent.dragStart(p);
    expect(container.querySelector('p')?.classList.contains('dragging')).toBe(false);
    await sleep(1);
    expect(container.querySelector('p')?.classList.contains('dragged')).toBe(false);

    unmount();
  });
});
