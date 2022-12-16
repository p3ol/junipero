import { ElementType, MutableRefObject } from 'react';

export declare type AlertRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: Boolean;
};
declare interface AlertProps extends React.ComponentPropsWithRef<any> {
  animate?: (
    alert: JSX.Element,
    opts: { enabled: Boolean, index: Number }
  ) => JSX.Element;
  className?: string;
  index?: any;
  title?: React.ReactNode | string | Function;
  lifespan?: number;
  tag?: String | ElementType;
  children?: string | React.ReactNode | Function;
  onDismiss?(index?: any): any;
  icon?: React.ReactNode | string | Function;
  ref?: MutableRefObject<AlertRef | undefined>;
}

export declare interface AlertObject {
  icon?: React.ReactNode | Function;
  index?: any;
  title?: React.ReactNode | string | Function;
  content: string | React.ReactNode | Function;
  duration?: number;
  lifespan?: number;
  onDismiss?: (index?: any) => any;
}

declare function Alert(props: AlertProps): JSX.Element;

export default Alert;
