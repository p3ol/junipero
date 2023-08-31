import { MutableRefObject, ReactNode, ComponentPropsWithRef, ElementType } from 'react';

import { ForwardedProps } from '../utils';

declare type AlertRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface AlertProps extends ComponentPropsWithRef<any> {
    animationTimeout?: number;
    children?: ReactNode | JSX.Element;
    className?: string;
    icon?: ReactNode | JSX.Element;
    index?: string | number;
    lifespan?: number;
    tag?: string | ElementType;
    animate?(alert: ReactNode | JSX.Element, opts: {
        opened: boolean;
        index: string | number;
    }): ReactNode | JSX.Element;
    onDismiss?(index?: string | number): void;
    ref?: MutableRefObject<AlertRef | undefined>;
}
export declare interface AlertObject {
    id?: number | string;
    animationTimeout?: number;
    content?: ReactNode | JSX.Element;
    icon?: ReactNode | JSX.Element;
    index?: string | number;
    title?: ReactNode | JSX.Element;
    duration?: number;
    type?: string;
    lifespan?: number;
    animate?(alert: ReactNode | JSX.Element, opts: {
        opened: boolean;
        index: string | number;
    }): ReactNode | JSX.Element;
    onDismiss?(index?: string | number): void;
}
declare const Alert: ForwardedProps<AlertProps, AlertRef>;
export default Alert;
