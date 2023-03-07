import { MutableRefObject } from 'react';

import { AlertObject } from '../Alert';

export declare type AlertsRef = {
  innerRef: MutableRefObject<any>;
  alerts: Array<AlertObject>;
  isJunipero: Boolean;
};

declare interface AlertsProps extends React.ComponentPropsWithRef<any> {
  classname?: String;
  ref?: MutableRefObject<AlertsRef | undefined>;
  animateAlert?: (
    alert: JSX.Element,
    opts: { enabled: Boolean, index: Number }
  ) => JSX.Element;
  animationTimeout?: number;
  icons?: Object;
}

declare function Alerts(props: AlertsProps): JSX.Element;

export default Alerts;
