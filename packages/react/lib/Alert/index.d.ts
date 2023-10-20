import {
  ReactNode,
  ElementType,
  MutableRefObject,
  ComponentPropsWithRef,
} from 'react';

export declare type AlertRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface AlertProps extends ComponentPropsWithRef<any> {
  animationTimeout?: number;
  children?: ReactNode | JSX.Element;
  className?: string;
  icon?: ReactNode | JSX.Element;
  index?: string | number;
  lifespan?: number;
  tag?: string | ElementType;
  title?: ReactNode | JSX.Element;
  animate?(
    alert: ReactNode | JSX.Element,
    opts: { opened: boolean; index: string | number }
  ): ReactNode | JSX.Element;
  onDismiss?(index?: string | number): void;
  ref?: MutableRefObject<AlertRef | undefined>;
}

export declare interface AlertObject {
  animationTimeout?: number;
  content: ReactNode | JSX.Element;
  icon?: ReactNode | JSX.Element;
  index?: string | number;
  title?: ReactNode | JSX.Element;
  type?: string;
  duration?: number;
  lifespan?: number;
  animate?(
    alert: ReactNode | JSX.Element,
    opts: { opened: boolean; index: string | number }
  ): ReactNode | JSX.Element;
  onDismiss?(index?: string | number): void;
}

declare function Alert(props: AlertProps): ReactNode | JSX.Element;

export default Alert;
