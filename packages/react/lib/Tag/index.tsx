import {
  type ElementType,
  type MouseEvent,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import { Remove } from '../icons';

export declare interface TagRef extends JuniperoRef {}

export declare interface TagProps
  extends SpecialComponentPropsWithRef<any, TagRef> {
  tag?: ElementType;
  onDelete?: () => void;
}

const Tag = ({
  ref,
  className,
  children,
  onDelete,
  tag: Comp = 'span',
  ...rest
}: TagProps) => {
  const innerRef = useRef<HTMLElement>(null);

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
};

Tag.displayName = 'Tag';

export default Tag;
