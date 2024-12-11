import {
  type ElementType,
  type RefObject,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';

export declare interface BadgeRef extends JuniperoRef {}

export declare interface BadgeProps
  extends SpecialComponentPropsWithRef<any, BadgeRef> {
  tag?: ElementType;
}

const Badge = ({
  ref,
  className,
  tag: Tag = 'span',
  ...rest
}: BadgeProps) => {
  const innerRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    isJunipero: true,
    innerRef,
  }));

  return (
    <Tag
      { ...rest }
      ref={innerRef}
      className={classNames('junipero', 'badge', className)}
    />
  );
};

Badge.displayName = 'Badge';

export default Badge;
