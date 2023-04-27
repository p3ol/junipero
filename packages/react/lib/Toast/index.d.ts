import {
  ReactNode,
  ComponentPropsWithRef,
  ElementType,
  MutableRefObject,
} from 'react';

export declare type ToastRef = {
  enabled: boolean;
  isJunipero: boolean;
  paused: boolean;
  remaining: number;
  innerRef: MutableRefObject<any>;
};

export declare interface ToastObject {
  animationTimeout?: number;
  content: ReactNode | JSX.Element;
  duration?: number;
  index: string | number;
  lifespan?: number;
  animate?(
    alert: ReactNode | JSX.Element,
    opts: { opened: boolean; index: string | number }
  ): JSX.Element;
  onDismiss?(index?: string | number): any;
}

declare interface ToastProps extends ComponentPropsWithRef<any> {
  animationTimeout?: number;
  children?: ReactNode | JSX.Element;
  className?: string;
  index?: string | number;
  lifespan?: number;
  tag?: string | ElementType;
  animate?(
    alert: ReactNode | JSX.Element,
    opts: { opened: boolean; index: string | number }
  ): JSX.Element;
  onDismiss?(index?: string | number): any;
  ref?: MutableRefObject<ToastRef | undefined>;
}

declare function Toast(props: ToastProps): ReactNode | JSX.Element;

export default Toast;
