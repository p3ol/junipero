import { MutableRefObject } from "react";
import { AlertObject, AlertProps } from "../Alert";

export declare type AlertsRef = {
  innerRef: MutableRefObject<any>;
  alerts: Array<AlertObject>;
  isJunipero: Boolean;
};
declare interface AlertsProps extends React.ComponentPropsWithRef<any> {
  classname?: String;
  ref?: MutableRefObject<AlertsRef | undefined>;
  animate?: (
    alert?: (props: AlertProps) => React.ReactNode,
    index?: any
  ) => JSX.Element;
}

declare function Alerts(props: AlertsProps): JSX.Element;

export default Alerts;
