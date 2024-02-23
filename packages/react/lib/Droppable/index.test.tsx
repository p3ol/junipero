import { createEvent, fireEvent, render } from '@testing-library/react';

import Droppable from '.';

describe('<Droppable />', () => {
  it('should render', () => {
    const onDragOver = jest.fn();
    const onDragLeave = jest.fn();
    const { container, unmount } = render(
      <Droppable onDragOver={onDragOver} onDragLeave={onDragLeave}>
        <p>hello</p>
      </Droppable>
    );
    expect(container).toMatchSnapshot();

    fireEvent.dragEnter(container.querySelector('p'));
    expect(container).toMatchSnapshot('drag entered');

    const dragAboveEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragAboveEvent, 'clientY', { value: -1 });
    fireEvent(container.querySelector('p'), dragAboveEvent);
    expect(onDragOver).toHaveBeenCalled();
    expect(container).toMatchSnapshot('drag above');

    const dragBelowEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragBelowEvent, 'clientY', { value: 1 });
    fireEvent(container.querySelector('p'), dragBelowEvent);
    expect(container).toMatchSnapshot('drag below');

    fireEvent.dragLeave(container.querySelector('p'));
    expect(container).toMatchSnapshot('drag leave');
    expect(onDragLeave).toHaveBeenCalled();

    unmount();
  });

  it('should trigger onDrop event when drop', () => {
    const onDrop = jest.fn();
    const { container, unmount } = render(
      <Droppable onDrop={onDrop}><p>hello</p></Droppable>
    );

    fireEvent.dragEnter(container.querySelector('p'));
    const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
    fireEvent(container.querySelector('p'), dragOverEvent);
    expect(container).toMatchSnapshot('drag over');

    fireEvent.drop(container.querySelector('p'), {
      dataTransfer: { getData: () => '{}' },
    });

    expect(onDrop).toHaveBeenCalled();

    unmount();
  });

  it('should not trigger anything when disabled', () => {
    const onDrop = jest.fn();
    const onDragOver = jest.fn();
    const onDragLeave = jest.fn();
    const { container, unmount } = render(
      <Droppable
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        disabled
      >
        <p>hello</p>
      </Droppable>
    );

    fireEvent.dragEnter(container.querySelector('p'));
    const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
    fireEvent(container.querySelector('p'), dragOverEvent);
    expect(container).toMatchSnapshot('drag over');

    fireEvent.drop(container.querySelector('p'), {
      dataTransfer: { getData: () => '{}' },
    });

    expect(onDrop).not.toHaveBeenCalled();
    expect(onDragOver).not.toHaveBeenCalled();
    expect(onDragLeave).not.toHaveBeenCalled();

    unmount();
  });
});
