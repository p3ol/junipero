import {
  type ElementType,
  type MutableRefObject,
  type ReactNode,
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
import type { TransitionProps } from '../Transition';

export declare interface BreadCrumbItemRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLElement>;
}

export declare interface BreadCrumbItemProps
  extends SpecialComponentPropsWithRef {
  tag?: string | ElementType;
  animate?(
    item: ReactNode | JSX.Element,
    opts?: Partial<TransitionProps>,
  ): ReactNode | JSX.Element;
}

const BreadCrumbItem = forwardRef<BreadCrumbItemRef, BreadCrumbItemProps>(({
  animate,
  className,
  tag: Tag = 'span',
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLElement>();

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
}) as ForwardedProps<BreadCrumbItemRef, BreadCrumbItemProps>;

BreadCrumbItem.displayName = 'BreadCrumbItem';

export default BreadCrumbItem;
