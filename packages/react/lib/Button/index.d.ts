import { ReactNode, ElementType, MutableRefObject } from 'react';

export declare type ButtonRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface ButtonProps extends React.ComponentPropsWithRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
  disabled?: boolean;
  tag?: string | ElementType;
  onClick?(e: Event): void;
  ref?: MutableRefObject<ButtonRef | undefined>;
}

declare function Button(props: ButtonProps): ReactNode | JSX.Element;

export default Button;
