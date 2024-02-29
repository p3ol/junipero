import {
  ComponentPropsWithRef,
  forwardRef,
  MutableRefObject,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames, omit } from '@junipero/core';
import PropTypes from 'prop-types';

import { useToasts } from '../hooks';
import Toast, { ToastObject } from '../Toast';
import { ForwardedProps } from '../utils';

export declare type ToastsRef = {
  isJunipero: boolean;
  toasts: Array<ToastObject>;
  innerRef: MutableRefObject<any>;
};

export declare interface ToastsProps extends ComponentPropsWithRef<any> {
  animationTimeout?: number;
  className?: string;
  animateToast?(
    toast: JSX.Element | Element,
    opts: { opened: boolean; index: string | number }
  ): JSX.Element| Element;
  ref?: MutableRefObject<ToastsRef | undefined>;
}
const Toasts = forwardRef(({
  className,
  animateToast,
  animationTimeout,
  ...rest
}: ToastsProps, ref) => {
  const innerRef = useRef();
  const { toasts, dismiss } = useToasts();

  useImperativeHandle(ref, () => ({
    innerRef,
    toasts,
    isJunipero: true,
  }));

  const onDismiss = (toast: ToastObject, index: number) => {
    dismiss?.(toast);
    toast?.onDismiss?.(index);
  };

  return (
    <div
      {...rest}
      ref={innerRef}
      className={classNames('junipero', 'toasts', className)}
    >
      { toasts?.map((toast, index) => (
        <Toast
          { ...omit(toast, [
            'id', 'content', 'lifespan', 'animate', 'animationTimeout',
            'onDismiss',
          ]) }
          key={toast.index ?? index}
          index={toast.index ?? index}
          animate={toast.animate ?? animateToast}
          animationTimeout={toast.animationTimeout ?? animationTimeout}
          lifespan={toast.duration ?? toast.lifespan}
          onDismiss={onDismiss.bind(null, toast, index)}
        >
          { toast.content }
        </Toast>
      )) }
    </div>
  );
}) as ForwardedProps<ToastsProps, ToastsRef>;

Toasts.displayName = 'Toasts';
Toasts.propTypes = {
  animateToast: PropTypes.func,
  animationTimeout: PropTypes.number,
};

export default Toasts;