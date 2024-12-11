import {
  type DragEvent,
  type ComponentPropsWithoutRef,
  type RefObject,
  type ReactElement,
  Children,
  cloneElement,
  useState,
  useEffect,
} from 'react';
import { classNames } from '@junipero/core';

export declare type DraggingPositionType = 'before' | 'after';

export declare type DroppableRef = any;

export declare interface DroppableProps
  extends ComponentPropsWithoutRef<any> {
  ref?: RefObject<DroppableRef>;
  disabled?: boolean;
  onDrop?(data: any, direction: DraggingPositionType, e: DragEvent): void;
  onDragOver?(e: DragEvent, direction: DraggingPositionType): void;
  onDragLeave?(e: DragEvent): void;
}

const Droppable = ({
  ref,
  className,
  children,
  disabled = false,
  onDrop,
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

  const onDragEnter_ = () => {
    if (disabled) {
      return;
    }

    setStack(s => s + 1);
    setDragging(true);
  };

  const onDragLeave_ = (e: any) => {
    if (disabled) {
      return;
    }

    setStack(s => s - 1);
    setDraggingPos(null);
    onDragLeave?.(e);
  };

  const onDrop_ = (e: DragEvent) => {
    if (disabled) {
      return;
    }

    setStack(0);
    setDragging(false);
    onDrop?.(JSON.parse(e.dataTransfer.getData('text')), draggingPos, e);
    e.preventDefault();
    setDraggingPos(null);
  };

  const onDragOver_ = (e: DragEvent) => {
    if (disabled) {
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

    setDraggingPos(draggingPosition);
    e.preventDefault();
    onDragOver?.(e, draggingPosition as DraggingPositionType);

    return false;
  };

  const child = Children
    .only<ReactElement<ComponentPropsWithoutRef<any>>>(children);

  return cloneElement(child, {
    ...rest,
    ref,
    className: classNames(
      className,
      child.props?.className,
      {
        'drag-enter': !disabled && dragging,
        'drag-top': !disabled && dragging && draggingPos &&
          draggingPos === 'before',
        'drag-bottom': !disabled && dragging && draggingPos &&
          draggingPos === 'after',
      },
    ),
    onDragEnter: onDragEnter_,
    onDragLeave: onDragLeave_,
    onDrop: onDrop_,
    onDragOver: onDragOver_,
  });
};

Droppable.displayName = 'Droppable';

export default Droppable;
