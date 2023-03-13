import { ReactNode, MutableRefObject, ComponentPropsWithoutRef } from 'react';

import { AlertObject } from '../Alert';

export declare type AlertsControlRef = {
  alerts: Array<AlertObject>;
  isJunipero: boolean;
  add(alert: AlertObject): void;
  dismiss(alert: AlertObject): void;
};

declare interface AlertsControlProps extends ComponentPropsWithoutRef<any> {
  alerts?: Array<AlertObject>;
  generateId(alert: AlertObject): string | number;
  ref?: MutableRefObject<AlertsControlRef | undefined>;
}

declare function AlertsControl(props: AlertsControlProps):
  ReactNode | JSX.Element;

export default AlertsControl;
