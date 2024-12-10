import {
  type RefObject,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames, omit } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import type { TransitionProps } from '../Transition';
import { useToasts } from '../hooks';
import Toast, { type ToastObject } from '../Toast';

export declare interface ToastsRef extends JuniperoRef {
  toasts: Array<ToastObject>;
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface ToastsProps
  extends SpecialComponentPropsWithRef<'div', ToastsRef> {
  animationTimeout?: number;
  animateToast?(
    toast: ReactNode,
    opts: {
      opened: boolean;
      index: string | number
    } & Partial<TransitionProps>,
  ): ReactNode;
}

const Toasts = ({
  ref,
  className,
  animationTimeout,
  animateToast,
  ...rest
}: ToastsProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
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
};

Toasts.displayName = 'Toasts';

export default Toasts;
