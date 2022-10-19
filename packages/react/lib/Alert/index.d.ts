import { ElementType } from "react";

export declare interface AlertProps extends React.ComponentPropsWithRef<any> {
  className?: string;
  index?: any;
  title?: React.ReactNode | string | Function;
  lifespan?: number;
  tag?: String | ElementType;
  children?: string | React.ReactNode | Function;
  onDismiss?(index?: any): any;
  icon?: React.ReactNode | string | Function;
}

export declare interface AlertObject {
  icon: React.ReactNode | Function;
  index?: any;
  title?: React.ReactNode | string | Function;
  content: string | React.ReactNode | Function;
  duration?: number;
  lifespan?: number;
  onDismiss?(index?: any): any;
}

declare function Alert(props: AlertProps): React.ReactNode;

export default Alert;
