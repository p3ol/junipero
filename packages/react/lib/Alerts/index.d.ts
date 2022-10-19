import { AlertProps } from "../Alert";
declare interface AlertsProps extends React.ComponentPropsWithRef<any> {
  classname?: String;
  animate?: (
    alert?: (props: AlertProps) => React.ReactNode,
    index?: any
  ) => React.ReactNode;
}

declare function Alerts(props: AlertsProps): React.ReactNode;

export default Alerts;
