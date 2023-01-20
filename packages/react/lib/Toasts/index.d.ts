import { MutableRefObject } from 'react';

import { ToastObject } from '../Toast';

export declare type ToastsRef = {
  innerRef: MutableRefObject<any>;
  toasts: Array<ToastObject>;
  isJunipero: Boolean;
};

declare interface ToastsProps extends React.ComponentPropsWithRef<any> {
  className?: String;
  ref?: MutableRefObject<ToastsRef | undefined>;
  animateToast?: (
    toast: JSX.Element,
    opts: { opened: boolean, index: string|number }
  ) => JSX.Element;
  animationTimeout?: number;
}

declare function Toasts(props: ToastsProps): JSX.Element;

export default Toasts;
