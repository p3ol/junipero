import { MutableRefObject } from 'react';

import { AlertObject } from '../Alert';

export declare type AlertsControlRef = {
  alerts: Array<AlertObject>;
  add: (alert: AlertObject) => void;
  dismiss: (index: number) => void;
  isJunipero: Boolean;
};
declare interface AlertsControlProps
  extends React.ComponentPropsWithoutRef<any> {
  alerts?: Array<AlertObject>;
  generateId: (alert: AlertObject) => string|number;
  ref?: MutableRefObject<AlertsControlRef | undefined>;
}

declare function AlertsControl(props: AlertsControlProps): JSX.Element;

export default AlertsControl;
