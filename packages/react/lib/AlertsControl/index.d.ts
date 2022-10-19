import { AlertObject } from "../Alert";

declare interface AlertsControlProps
  extends React.ComponentPropsWithoutRef<any> {
  alerts?: Array<AlertObject>;
}

declare function AlertsControl(props: AlertsControlProps): React.ReactNode;

export default AlertsControl;
