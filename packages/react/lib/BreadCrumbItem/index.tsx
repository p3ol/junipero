import {
  type ComponentPropsWithRef,
  type ElementType,
  type MutableRefObject,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { type ForwardedProps, classNames } from '@junipero/core';
import PropTypes from 'prop-types';

export declare type BreadCrumbItemRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface BreadCrumbItemProps
  extends ComponentPropsWithRef<any> {
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
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
  ]),
  animate: PropTypes.func,
};

export default BreadCrumbItem;
