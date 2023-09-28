import {
  ReactNode,
  ElementType,
  MutableRefObject,
  ComponentPropsWithRef,
} from 'react';

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

declare function Button(props: ButtonProps): ReactNode | JSX.Element;

export default Button;
