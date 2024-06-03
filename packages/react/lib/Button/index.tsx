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

export declare type ButtonRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface ButtonProps extends ComponentPropsWithRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
  disabled?: boolean;
  tag?: string | ElementType;
  onClick?(e: Event): void;
  ref?: MutableRefObject<ButtonRef | undefined>;
}

const Button = forwardRef(({
  className,
  disabled,
  tag: Tag = 'button',
  onClick,
  ...rest
}: ButtonProps, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const onClick_ = (e: Event) => {
    if (disabled) {
      e.preventDefault();

      return;
    }

    onClick?.(e);
  };

  return (
    <Tag
      { ...rest }
      disabled={disabled}
      className={classNames('junipero', 'button', { disabled }, className)}
      ref={innerRef}
      onClick={onClick_}
    />
  );
}) as ForwardedProps<ButtonProps, ButtonRef>;

Button.displayName = 'Button';
Button.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  tag: PropTypes.any, // TODO fixme
};

export default Button;
