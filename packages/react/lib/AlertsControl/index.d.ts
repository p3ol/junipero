import { ComponentPropsWithRef, MutableRefObject } from 'react';
import { AlertObject } from '../Alert';
import { ForwardedProps } from '../utils';
export declare type AlertsControlRef = {
    alerts: Array<AlertObject>;
    isJunipero: boolean;
    add(alert: AlertObject): void;
    dismiss(alert: AlertObject): void;
} | React.RefAttributes<HTMLElement>;
declare interface AlertsControlProps extends ComponentPropsWithRef<any> {
    alerts?: Array<AlertObject>;
    generateId?: (alert: AlertObject) => string | number;
    ref?: MutableRefObject<AlertsControlRef | undefined>;
    children?: React.ReactNode;
}
declare const AlertsControl: ForwardedProps<AlertsControlProps, AlertsControlRef>;
export default AlertsControl;
