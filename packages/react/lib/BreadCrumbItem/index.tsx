import {
  type ElementType,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import type { TransitionProps } from '../Transition';

export declare interface BreadCrumbItemRef extends JuniperoRef {}

export declare interface BreadCrumbItemProps
  extends SpecialComponentPropsWithRef<any, BreadCrumbItemRef> {
  tag?: ElementType;
  animate?(
    item: ReactNode,
    opts?: Partial<TransitionProps>,
  ): ReactNode;
}

const BreadCrumbItem = ({
  ref,
  className,
  tag: Tag = 'span',
  animate,
  ...rest
}: BreadCrumbItemProps) => {
  const innerRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const rendered = (
    <Tag
      { ...rest }
      className={classNames(
        'item',
        className
      )}
      ref={innerRef}
    />
  );

  return animate ? animate(rendered) : rendered;
};

BreadCrumbItem.displayName = 'BreadCrumbItem';

export default BreadCrumbItem;
