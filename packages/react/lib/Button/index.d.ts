import { ElementType, MutableRefObject } from 'react';

export declare type ButtonRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: Boolean;
};

declare interface ButtonProps extends React.ComponentPropsWithRef<any> {
  className?: string;
  disabled?: Boolean;
  tag?: String | ElementType;
  onClick?: (e: Event) => any;
  ref?: MutableRefObject<ButtonRef | undefined>;
}

declare function Button(props: ButtonProps): JSX.Element;

export default Button;
