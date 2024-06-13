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
  SpecialComponentPropsWithoutRef,
} from '../types';

export declare interface CardRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLElement>;
}

export declare interface CardProps extends SpecialComponentPropsWithoutRef {
  tag?: string | ElementType;
}

const Card = forwardRef<CardRef, CardProps>(({
  className,
  tag: Tag = 'div',
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLElement>();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <Tag
      { ...rest }
      className={classNames('junipero', 'card', className)}
      ref={innerRef}
    />
  );
}) as ForwardedProps<CardRef, CardProps>;

Card.displayName = 'Card';

export default Card;
