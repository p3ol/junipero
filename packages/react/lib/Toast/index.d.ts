import { ElementType, MutableRefObject } from 'react';

export declare type ToastRef = {
  innerRef: MutableRefObject<any>;
  enabled: boolean;
  paused: boolean;
  remaining: number;
  isJunipero: boolean;
};

export declare interface ToastObject {
  index?: string|number;
  content?: string | React.ReactNode | Function;
  duration?: number;
  lifespan?: number;
  onDismiss?: (index?: string|number) => any;
}

declare interface ToastProps extends React.ComponentPropsWithRef<any> {
  animate?: (
    alert: JSX.Element,
    opts: { opened: boolean, index: string|number }
  ) => JSX.Element;
  animationTimeout?: number;
  className?: string;
  index?: string|number;
  lifespan?: number;
  tag?: String | ElementType;
  children?: string | React.ReactNode | Function;
  onDismiss?(index?: string|number): any;
  ref?: MutableRefObject<ToastRef | undefined>;
}

declare function Toast(props: ToastProps): JSX.Element;

export default Toast;
