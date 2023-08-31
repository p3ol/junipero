import { ComponentPropsWithoutRef, MutableRefObject } from 'react';
import { ToastObject } from '../Toast';
import { ForwardedProps } from '../utils';
export declare type ToastsControlRef = {
    isJunipero: boolean;
    toasts: Array<ToastObject>;
    add(toast: ToastObject): void;
    dismiss(toast: ToastObject, index: string | number): void;
};
export declare interface ToastsControlProps extends ComponentPropsWithoutRef<any> {
    toasts?: Array<ToastObject>;
    generateId?(toast: ToastObject): string | number;
    ref?: MutableRefObject<ToastsControlRef | undefined>;
}
declare const ToastsControl: ForwardedProps<ToastsControlProps, ToastsControlRef>;
export default ToastsControl;
