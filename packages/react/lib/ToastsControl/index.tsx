import {
  type ComponentPropsWithRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

import type { JuniperoRef } from '../types';
import type { ToastObject } from '../Toast';
import { ToastsContext, type ToastsContextType } from '../contexts';

export declare interface ToastsControlRef extends JuniperoRef {
  toasts: Array<ToastObject>;
  add(toast: ToastObject): void;
  dismiss(toast: ToastObject, index: string | number): void;
}

export declare interface ToastsControlProps extends Omit<
  ComponentPropsWithRef<typeof ToastsContext.Provider>, 'value'
> {
  toasts?: Array<ToastObject>;
  generateId?(toast: ToastObject): string | number;
}

const ToastsControl = forwardRef<ToastsControlRef, ToastsControlProps>(({
  toasts: toastsProp,
  generateId,
  ...rest
}, ref) => {
  const [toasts, setToasts] = useState(toastsProp || []);

  useImperativeHandle(ref, () => ({
    toasts,
    add,
    dismiss,
    isJunipero: true,
  }));

  const add = (toast: ToastObject) => {
    toast.index = toast.index ||
      generateId ? generateId(toast) : Math.random().toString(36);

    setToasts(t => t.concat(toast));
  };

  const dismiss = (toast: ToastObject) => {
    setToasts(t => t.filter(i => i !== toast));
  };

  const getContext = useCallback<() => ToastsContextType>(() => ({
    toasts,
    add,
    dismiss,
  }), [toasts]);

  return (
    <ToastsContext.Provider { ...rest } value={getContext()} />
  );
});

ToastsControl.displayName = 'ToastsControl';

export default ToastsControl;
