import {
  Children,
  cloneElement,
  forwardRef,
  useState,
  DragEvent,
  ComponentPropsWithRef,
  ReactNode,
} from 'react';
import { classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';
import PropTypes from 'prop-types';

import { ForwardedProps } from '../utils';

declare interface DraggableProps extends ComponentPropsWithRef<any> {
  children?: JSX.Element;
  className?: string;
  data?: any;
  disabled?: boolean;
  dragImage?: Element;
  dragImageOffset?: { x: number; y: number };
  onDrag?(e: Event): void;
  onBeforeDragStart?(e: DragEvent): void;
  onDragStart?(e: DragEvent, target?: DOMRect): void;
  onDragEnd?(e: DragEvent): void;
}

const Draggable = forwardRef(({
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
}: DraggableProps, ref) => {
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

  const onDragEnd_ = e => {
    if (disabled) {
      return;
    }

    setDragged(false);
    onDragEnd?.(e);
  };

  const onDrag_ = e => {
    if (disabled) {
      return;
    }

    onDrag?.(e);
  };

  const child = Children.only(children);

  return cloneElement(child, {
    ...rest,
    ref,
    className: classNames(
      className,
      child.props.className,
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
}) as ForwardedProps<DraggableProps, any>;

Draggable.displayName = 'Draggable';
Draggable.propTypes = {
  disabled: PropTypes.bool,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
    PropTypes.number,
  ]),
  dragImage: PropTypes.any, //TODO fixme
  dragImageOffset: PropTypes.any, //TODO fixme
  onDrag: PropTypes.func,
  onBeforeDragStart: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
};

export default Draggable;
