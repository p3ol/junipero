import { AlertObject } from "../Alert";

declare interface AlertsControlProps {
  alerts: Array<AlertObject>;
  [key: string]: any;
}

declare function AlertsControl(props: AlertsControlProps): JSX.Element;

export default AlertsControl;
