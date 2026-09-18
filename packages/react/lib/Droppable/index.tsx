import {
  type DragEvent,
  type ComponentPropsWithoutRef,
  type Ref,
  useState,
  useEffect,
} from 'react';
import { classNames } from '@junipero/core';
import { Slot } from '@radix-ui/react-slot';

export declare type DraggingPositionType = 'before' | 'after';

export declare type DroppableRef = any;

export declare interface DroppableProps
  extends ComponentPropsWithoutRef<any> {
  ref?: Ref<DroppableRef>;
  disabled?: boolean;
  onDrop?(data: any, direction: DraggingPositionType, e: DragEvent): void;
  onDragEnter?(e: DragEvent): void;
  onDragOver?(e: DragEvent, direction: DraggingPositionType): void;
  onDragLeave?(e: DragEvent): void;
}

const Droppable = ({
  ref,
  className,
  disabled = false,
  onDrop,
  onDragEnter,
  onDragOver,
  onDragLeave,
  ...rest
}: DroppableProps) => {
  const [dragging, setDragging] = useState(false);
  const [stack, setStack] = useState(0);
  const [draggingPos, setDraggingPos] = useState(null);

  useEffect(() => {
    if (stack <= 0) {
      setDragging(false);
    }
  }, [stack]);

  const onDragEnter_ = (e: DragEvent) => {
    if (disabled || e.defaultPrevented) {
      return;
    }

    onDragEnter?.(e);

    if (e.defaultPrevented) {
      return;
    }

    setStack(s => s + 1);
    setDragging(true);
  };

  const onDragLeave_ = (e: DragEvent) => {
    if (disabled || e.defaultPrevented) {
      return;
    }

    onDragLeave?.(e);

    if (e.defaultPrevented) {
      return;
    }

    setStack(s => s - 1);
    setDraggingPos(null);
  };

  const onDrop_ = (e: DragEvent) => {
    if (disabled || e.defaultPrevented) {
      return;
    }

    onDrop?.(JSON.parse(e.dataTransfer.getData('text')), draggingPos, e);

    if (e.defaultPrevented) {
      return;
    }

    setStack(0);
    setDragging(false);
    setDraggingPos(null);
    e.preventDefault();
  };

  const onDragOver_ = (e: DragEvent) => {
    if (disabled || e.defaultPrevented) {
      return;
    }

    const targetRect = e.currentTarget.getBoundingClientRect();
    const targetMiddleY = targetRect?.top + targetRect?.height / 2;
    let draggingPosition;

    if (e.clientY >= targetMiddleY) {
      draggingPosition = 'after';
    } else if (e.clientY < targetMiddleY) {
      draggingPosition = 'before';
    }

    onDragOver?.(e, draggingPosition as DraggingPositionType);

    if (e.defaultPrevented) {
      return;
    }

    setDraggingPos(draggingPosition);
    e.preventDefault();
  };

  return (
    <Slot
      { ...rest }
      ref={ref}
      className={classNames(
        className,
        {
          'drag-enter': !disabled && dragging,
          'drag-top': !disabled && dragging && draggingPos &&
            draggingPos === 'before',
          'drag-bottom': !disabled && dragging && draggingPos &&
            draggingPos === 'after',
        },
      )}
      onDragEnter={onDragEnter_}
      onDragLeave={onDragLeave_}
      onDrop={onDrop_}
      onDragOver={onDragOver_}
    />
  );
};

Droppable.displayName = 'Droppable';

export default Droppable;
