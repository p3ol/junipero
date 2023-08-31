import { ComponentPropsWithRef, MutableRefObject } from 'react';
import { ToastObject } from '../Toast';
import { ForwardedProps } from '../utils';
export declare type ToastsRef = {
    isJunipero: boolean;
    toasts: Array<ToastObject>;
    innerRef: MutableRefObject<any>;
};
export declare interface ToastsProps extends ComponentPropsWithRef<any> {
    animationTimeout?: number;
    className?: string;
    animateToast?(toast: JSX.Element, opts: {
        opened: boolean;
        index: string | number;
    }): JSX.Element;
    ref?: MutableRefObject<ToastsRef | undefined>;
}
declare const Toasts: ForwardedProps<ToastsProps, ToastsRef>;
export default Toasts;
