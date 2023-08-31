import { ComponentPropsWithRef, ElementType, MutableRefObject, ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { ForwardedProps } from '../utils';

export declare type BreadCrumbItemRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface BreadCrumbItemProps extends ComponentPropsWithRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
  tag?: string | ElementType;
  animate?(item: ReactNode | JSX.Element): ReactNode | JSX.Element;
  ref?: MutableRefObject<BreadCrumbItemRef | undefined>;
}

const BreadCrumbItem = forwardRef(({
  animate,
  className,
  tag: Tag = 'span',
  ...rest
}: BreadCrumbItemProps, ref) => {
  const innerRef = useRef();

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
}) as ForwardedProps<BreadCrumbItemProps, BreadCrumbItemRef>;

BreadCrumbItem.displayName = 'BreadCrumbItem';
BreadCrumbItem.propTypes = {
  tag: PropTypes.any, // TODO fixme
  animate: PropTypes.func,
};
export default BreadCrumbItem;
