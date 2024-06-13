import {
  type ElementType,
  type MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  ForwardedProps,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';

export declare interface BadgeRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLElement>;
}

export declare interface BadgeProps extends SpecialComponentPropsWithRef {
  tag?: string | ElementType;
}

const Badge = forwardRef<BadgeRef, BadgeProps>(({
  className,
  tag: Tag = 'span',
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLElement>();

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
}) as ForwardedProps<BadgeRef, BadgeProps>;

Badge.displayName = 'Badge';

export default Badge;
