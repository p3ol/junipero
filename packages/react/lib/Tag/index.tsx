import {
  type ElementType,
  type MouseEvent,
  type MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  ForwardedProps,
  JuniperoRef,
  SpecialComponentPropsWithoutRef,
} from '../types';
import { Remove } from '../icons';

export declare interface TagRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLElement>;
}

export declare interface TagProps extends SpecialComponentPropsWithoutRef {
  tag?: string | ElementType;
  onDelete?: () => void;
}

const Tag = forwardRef<TagRef, TagProps>(({
  className,
  children,
  onDelete,
  tag: Comp = 'span',
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLElement>();

  useImperativeHandle(ref, () => ({
    isJunipero: true,
    innerRef,
  }));

  const onDelete_ = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const content = onDelete ? <span>{ children }</span> : children;

  return (
    <Comp
      { ...rest }
      ref={innerRef}
      className={classNames('junipero', 'tag', className)}
    >
      { content }
      { onDelete && (
        <Remove onClick={onDelete_} />
      ) }
    </Comp>
  );
}) as ForwardedProps<TagRef, TagProps>;

Tag.displayName = 'Tag';

export default Tag;
