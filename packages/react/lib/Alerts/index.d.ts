import { AlertProps } from "../Alert";
declare interface AlertsProps {
  classname?: String;
  animate?: (
    alert?: (props: AlertProps) => JSX.Element,
    index?: any
  ) => JSX.Element;
  [key: string]: any;
}

declare function Alerts(props: AlertsProps): JSX.Element;

export default Alerts;
