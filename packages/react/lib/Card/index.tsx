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

export declare type CardRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface CardProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  tag?: string | ElementType;
  ref?: MutableRefObject<CardRef | undefined>;
}

const Card = forwardRef(({
  className,
  tag: Tag = 'div',
  ...rest
}: CardProps, ref) => {
  const innerRef = useRef();

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
}) as ForwardedProps<CardProps, CardRef>;

Card.displayName = 'Card';
Card.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
  ]),
};

export default Card;
