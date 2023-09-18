import {
  Children,
  cloneElement,
  forwardRef,
  useState,
  useEffect,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
} from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { ForwardedProps } from '../utils';

declare interface DroppableProps extends ComponentPropsWithRef<any> {
  className?: string;
  children?: JSX.Element;
  disabled?: boolean;
  onDrop?(data: any, direction: 'before' | 'after', e: Event): void;
  onDragOver?(e: Event, direction: 'before' | 'after'): void;
  onDragLeave?(e: Event): void;
}

const Droppable = forwardRef(({
  className,
  children,
  disabled = false,
  onDrop,
  onDragOver,
  onDragLeave,
  ...rest
}: DroppableProps, ref) => {
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

  const onDrop_ = e => {
    if (disabled) {
      return;
    }

    setStack(0);
    setDragging(false);
    onDrop?.(JSON.parse(e.dataTransfer.getData('text')), draggingPos, e);
    e.preventDefault();
    setDraggingPos(null);
  };

  const onDragOver_ = e => {
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
    onDragOver?.(e, draggingPosition);

    return false;
  };

  const child = Children.only(children);

  return cloneElement(child, {
    ...rest,
    ref,
    className: classNames(
      className,
      child.props.className,
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
}); // TODO find a way to put ForwardedProps back

Droppable.displayName = 'Droppable';
Droppable.propTypes = {
  disabled: PropTypes.bool,
  onDrop: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragLeave: PropTypes.func,
};

export default Droppable;
