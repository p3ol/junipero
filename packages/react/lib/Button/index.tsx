import {
  type ElementType,
  type MouseEvent,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';

export declare interface ButtonRef extends JuniperoRef {}

export declare interface ButtonProps
  extends SpecialComponentPropsWithRef<any, ButtonRef> {
  disabled?: boolean;
  tag?: ElementType;
  onClick?(e: MouseEvent<HTMLElement>): void;
}

const Button = ({
  ref,
  className,
  disabled,
  tag: Tag = 'button',
  onClick,
  ...rest
}: ButtonProps) => {
  const innerRef = useRef<HTMLElement>(null);

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
      // WCAG 2.0
      role="button"
      aria-disabled={disabled}
    />
  );
};

Button.displayName = 'Button';

export default Button;
