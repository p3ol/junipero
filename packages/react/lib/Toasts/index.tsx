import {
  type ComponentPropsWithRef,
  type MutableRefObject,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames, omit } from '@junipero/core';

import type { JuniperoRef } from '../types';
import type { TransitionProps } from '../Transition';
import { useToasts } from '../hooks';
import Toast, { type ToastObject } from '../Toast';

export declare interface ToastsRef extends JuniperoRef {
  toasts: Array<ToastObject>;
  innerRef: MutableRefObject<HTMLDivElement>;
}

export declare interface ToastsProps extends ComponentPropsWithRef<'div'> {
  animationTimeout?: number;
  animateToast?(
    toast: ReactNode | JSX.Element,
    opts: {
      opened: boolean;
      index: string | number
    } & Partial<TransitionProps>,
  ): JSX.Element| ReactNode;
}

const Toasts = forwardRef<ToastsRef, ToastsProps>(({
  className,
  animateToast,
  animationTimeout,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLDivElement>();
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
      { ...rest }
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
});

Toasts.displayName = 'Toasts';

export default Toasts;
