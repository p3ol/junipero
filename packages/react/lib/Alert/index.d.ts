export declare interface AlertProps extends React.ComponentPropsWithRef<any> {
  className?: string;
  index?: any;
  title?: JSX.Element | string | Function;
  lifespan?: number;
  tag?: String | JSX.Element;
  children?: string | JSX.Element | Function;
  onDismiss?(index?: any): any;
  icon?: JSX.Element | string | Function;
}

export declare interface AlertObject {
  icon: JSX.Element | string | Function;
  index?: any;
  title?: JSX.Element | string | Function;
  content: string | JSX.Element | Function;
  duration?: number;
  lifespan?: number;
  onDismiss?(index?: any): any;
}

declare function Alert(props: AlertProps): JSX.Element;

export default Alert;
