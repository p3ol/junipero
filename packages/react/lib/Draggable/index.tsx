import {
  type DragEvent,
  type ComponentPropsWithoutRef,
  type Ref,
  cloneElement,
  useState,
  use,
} from 'react';
import { classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';

import { ReactElt, ReactLazy } from '../types';

export declare type DraggableRef = any;

export declare interface DraggableProps
  extends ComponentPropsWithoutRef<any> {
  ref?: Ref<DraggableRef>;
  data?: any;
  disabled?: boolean;
  dragImage?: Element;
  dragImageOffset?: { x: number; y: number };
  onDrag?(e: DragEvent<HTMLElement>): void;
  onBeforeDragStart?(e: DragEvent): void;
  onDragStart?(e: DragEvent, target?: DOMRect): void;
  onDragEnd?(e: DragEvent): void;
}

const Draggable = ({
  ref,
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
}: DraggableProps) => {
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
    } catch {}

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

  const child: ReactElt | ReactLazy = typeof children !== 'string' && Array.isArray(children)
    ? children[0] : children;

  return cloneElement(
    (child as ReactLazy).$$typeof === Symbol.for('react.lazy')
      ? use<ReactElt>((child as ReactLazy)._payload) : child as ReactElt,
    {
      ...rest,
      ref,
      className: classNames(
        className,
        (child as ReactElt).props?.className,
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
    }
  );
};

Draggable.displayName = 'Draggable';

export default Draggable;
