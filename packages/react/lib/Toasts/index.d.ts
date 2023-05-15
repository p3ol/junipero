import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

import { ToastObject } from '../Toast';

export declare type ToastsRef = {
  isJunipero: boolean;
  toasts: Array<ToastObject>;
  innerRef: MutableRefObject<any>;
};

declare interface ToastsProps extends ComponentPropsWithRef<any> {
  animationTimeout?: number;
  className?: string;
  animateToast?(
    toast: ReactNode | JSX.Element,
    opts: { opened: boolean; index: string | number }
  ): ReactNode | JSX.Element;
  ref?: MutableRefObject<ToastsRef | undefined>;
}

declare function Toasts(props: ToastsProps): JSX.Element;

export default Toasts;
