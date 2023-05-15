import { ReactNode, ComponentPropsWithoutRef, MutableRefObject } from 'react';

import { ToastObject } from '../Toast';

export declare type ToastsControlRef = {
  isJunipero: boolean;
  toasts: Array<ToastObject>;
  add(toast: ToastObject): void;
  dismiss(toast: ToastObject, index: string | number): void;
};

declare interface ToastsControlProps extends ComponentPropsWithoutRef<any> {
  toasts?: Array<ToastObject>;
  generateId?(toast: ToastObject): string | number;
  ref?: MutableRefObject<ToastsControlRef | undefined>;
}

declare function ToastsControl(props: ToastsControlProps):
  ReactNode | JSX.Element;

export default ToastsControl;
