import { ComponentPropsWithRef, MutableRefObject, ReactNode } from 'react';
import { AlertObject } from '../Alert';
import { ForwardedProps } from '../utils';
export declare type AlertsRef = {
    alerts: Array<AlertObject>;
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface AlertsProps extends ComponentPropsWithRef<any> {
    animationTimeout?: number;
    className?: string;
    icons?: {
        danger?: ReactNode | JSX.Element;
        default?: ReactNode | JSX.Element;
        primary?: ReactNode | JSX.Element;
        success?: ReactNode | JSX.Element;
        warning?: ReactNode | JSX.Element;
    };
    animateAlert?(alert: ReactNode | JSX.Element, opts: {
        opened: boolean;
        index: string | number;
    }): ReactNode | JSX.Element;
    ref?: MutableRefObject<AlertsRef | undefined>;
}
declare const Alerts: ForwardedProps<AlertsProps, AlertsRef>;
export default Alerts;
