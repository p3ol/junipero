import {
  type DragEvent,
  type MutableRefObject,
  Children,
  cloneElement,
  forwardRef,
  useState,
} from 'react';
import { classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';

import type { SpecialComponentPropsWithRef } from '../types';

export declare interface DraggableRef extends MutableRefObject<any> {}

export declare interface DraggableProps extends SpecialComponentPropsWithRef {
  data?: any;
  disabled?: boolean;
  dragImage?: Element;
  dragImageOffset?: { x: number; y: number };
  onDrag?(e: DragEvent<HTMLElement>): void;
  onBeforeDragStart?(e: DragEvent): void;
  onDragStart?(e: DragEvent, target?: DOMRect): void;
  onDragEnd?(e: DragEvent): void;
}

const Draggable = forwardRef<DraggableRef, DraggableProps>(({
  className,
  children,
  dragImage,
  disabled = false,
  data = {},
  dragImageOffset = { x: 0, y: 0 },
  onDrag,
  onBeforeDragStart,
  onDragStart,
  onDragEnd,
  ...rest
}, ref) => {
  const [dragged, setDragged] = useState(false);
  const [dragAnimation, setDragAnimation] = useState(false);

  useTimeout(() => {
    if (dragAnimation) {
      setDragged(true);
      setDragAnimation(false);
    }
  }, 0, [dragAnimation]);

  const onDragStart_ = (e: DragEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }

    onBeforeDragStart?.(e);

    const targetRect = e.currentTarget.getBoundingClientRect();

    try {
      e.dataTransfer.setData?.('text', JSON.stringify(data));

      if (dragImage) {
        e.dataTransfer.setDragImage(
          dragImage,
          dragImageOffset.x,
          dragImageOffset.y
        );
      }
    } catch (err) {}

    setDragAnimation(true);
    onDragStart?.(e, targetRect);
  };

  const onDragEnd_ = (e: DragEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }

    setDragged(false);
    onDragEnd?.(e);
  };

  const onDrag_ = (e: DragEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }

    onDrag?.(e);
  };

  const child = Children.only(children);

  return cloneElement(child as JSX.Element, {
    ...rest,
    ref,
    className: classNames(
      className,
      (child as JSX.Element).props?.className,
      {
        dragging: !disabled && dragAnimation,
        dragged: !disabled && dragged,
        draggable: !disabled,
      }
    ),
    draggable: !disabled,
    onDragStart: onDragStart_,
    onDrag: onDrag_,
    onDragEnd: onDragEnd_,
  });
});

Draggable.displayName = 'Draggable';

export default Draggable;
