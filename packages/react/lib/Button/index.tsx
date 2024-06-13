import {
  type ElementType,
  type MutableRefObject,
  type MouseEvent,
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

export declare interface ButtonRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLElement>;
}

export declare interface ButtonProps extends SpecialComponentPropsWithRef {
  disabled?: boolean;
  tag?: string | ElementType;
  onClick?(e: MouseEvent<HTMLElement>): void;
}

const Button = forwardRef<ButtonRef, ButtonProps>(({
  className,
  disabled,
  tag: Tag = 'button',
  onClick,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLElement>();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const onClick_ = (e: MouseEvent<HTMLElement>) => {
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
}) as ForwardedProps<ButtonRef, ButtonProps>;

Button.displayName = 'Button';

export default Button;
