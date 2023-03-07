import { MutableRefObject } from 'react';

import { ToastObject } from '../Toast';

export declare type ToastsControlRef = {
  toasts: Array<ToastObject>;
  add: (toast: ToastObject) => void;
  dismiss: (toast: ToastObject, index: string|number) => void;
  isJunipero: Boolean;
};

declare interface ToastsControlProps
  extends React.ComponentPropsWithoutRef<any> {
  toasts?: Array<ToastObject>;
  generateId: (toast: ToastObject) => string|number;
  ref?: MutableRefObject<ToastsControlRef | undefined>;
}

declare function ToastsControl(props: ToastsControlProps): JSX.Element;

export default ToastsControl;
