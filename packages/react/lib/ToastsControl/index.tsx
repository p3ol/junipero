import {
  ComponentPropsWithoutRef,
  forwardRef,
  MutableRefObject,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import { ListContextType, ToastsContext, ToastsContextType } from '../contexts';
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

const ToastsControl = forwardRef(({
  toasts: toastsProp,
  generateId,
  ...rest
}: ToastsControlProps, ref) => {
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
}) as ForwardedProps<ToastsControlProps, ToastsControlRef>;

ToastsControl.displayName = 'ToastsControl';
ToastsControl.propTypes = {
  toasts: PropTypes.array,
  generateId: PropTypes.func,
};

export default ToastsControl;
