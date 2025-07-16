import {
  type ComponentPropsWithoutRef,
  type Ref,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

import type { JuniperoRef } from '../types';
import type { ToastObject } from '../Toast';
import { ToastsContext, type ToastsContextType } from '../contexts';

export declare interface ToastsControlRef extends JuniperoRef {
  toasts: ToastObject[];
  add(toast: ToastObject): void;
  dismiss(toast: ToastObject, index: string | number): void;
}

export declare interface ToastsControlProps extends Omit<
  ComponentPropsWithoutRef<typeof ToastsContext.Provider>, 'value'
> {
  ref?: Ref<ToastsControlRef>;
  toasts?: ToastObject[];
  generateId?(toast: ToastObject): string | number;
}

const ToastsControl = ({
  ref,
  toasts: toastsProp,
  generateId,
  ...rest
}: ToastsControlProps) => {
  const [toasts, setToasts] = useState(toastsProp || []);

  useImperativeHandle(ref, () => ({
    toasts,
    add,
    dismiss,
    isJunipero: true,
  }));

  const add = useCallback((toast: ToastObject) => {
    toast.index = toast.index ||
      generateId ? generateId(toast) : Math.random().toString(36);

    setToasts(t => t.concat(toast));
  }, [generateId]);

  const dismiss = useCallback((toast: ToastObject) => {
    setToasts(t => t.filter(i => i !== toast));
  }, []);

  const getContext = useCallback((): ToastsContextType => ({
    toasts,
    add,
    dismiss,
  }), [toasts, add, dismiss]);

  return (
    <ToastsContext.Provider { ...rest } value={getContext()} />
  );
};

ToastsControl.displayName = 'ToastsControl';

export default ToastsControl;
