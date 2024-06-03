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

export declare type BadgeRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface BadgeProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  tag?: string | ElementType;
  ref?: MutableRefObject<BadgeRef>;
}

const Badge = forwardRef(({
  className,
  tag: Tag = 'span',
  ...rest
}: BadgeProps, ref) => {
  const innerRef = useRef();

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
}) as ForwardedProps<BadgeProps, BadgeRef>;

Badge.displayName = 'Badge';
Badge.propTypes = {
  tag: PropTypes.any, //TODO fixme
};

export default Badge;
