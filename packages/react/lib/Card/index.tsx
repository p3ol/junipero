import {
  type ElementType,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';

export declare interface CardRef extends JuniperoRef {}

export declare interface CardProps
  extends SpecialComponentPropsWithRef<any, CardRef> {
  tag?: ElementType;
}

const Card = ({
  ref,
  className,
  tag: Tag = 'div',
  ...rest
}: CardProps) => {
  const innerRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <Tag
      { ...rest }
      className={classNames('junipero card', className)}
      ref={innerRef}
    />
  );
};

Card.displayName = 'Card';

export default Card;
