import {
  type ReactNode,
  type ElementType,
  type MutableRefObject,
  type MouseEvent,
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';

import type {
  ForwardedProps,
  JuniperoRef,
  SpecialComponentPropsWithoutRef,
} from '../types';
import type { TransitionProps } from '../Transition';

export declare interface ToastRef extends JuniperoRef {
  enabled: boolean;
  paused: boolean;
  remaining: number;
  innerRef: MutableRefObject<HTMLElement>;
}

export declare interface ToastObject {
  animationTimeout?: number;
  content?: ReactNode | JSX.Element;
  duration?: number;
  index?: string | number;
  lifespan?: number;
  animate?(
    alert: ReactNode | JSX.Element,
    opts: {
      opened: boolean;
      index: string | number;
    } & Partial<TransitionProps>,
  ): ReactNode | JSX.Element;
  onDismiss?(index?: string | number): any;
}

export declare interface ToastProps extends SpecialComponentPropsWithoutRef {
  animationTimeout?: number;
  index?: string | number;
  lifespan?: number;
  tag?: string | ElementType;
  animate?(
    alert: ReactNode | JSX.Element,
    opts?: {
      opened: boolean;
      index: string | number;
    } & Partial<TransitionProps>,
  ): ReactNode | JSX.Element;
  onDismiss?(index?: string | number): any;
}

const Toast = forwardRef<ToastRef, ToastProps>(({
  tag: Tag = 'div',
  animationTimeout = 100,
  pausable = true,
  lifespan = 0,
  index,
  animate,
  children,
  className,
  onDismiss,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...rest
}, ref) => {
  const timeout = animate ? animationTimeout : 0;
  const innerRef = useRef<HTMLElement>();
  const startTimeRef = useRef(Date.now() + timeout);
  const [remaining, setRemaining] = useState(lifespan);
  const [enabled, setEnabled] = useState(true);
  const [paused, setPaused] = useState(false);

  useImperativeHandle(ref, () => ({
    enabled,
    paused,
    remaining,
    innerRef,
    isJunipero: true,
  }));

  useTimeout(() => {
    setEnabled(false);
  }, remaining, [remaining, paused], { enabled: lifespan > 0 && !paused });

  useTimeout(() => {
    onDismiss?.(index);
  }, timeout, [enabled], { enabled: !enabled && !paused });

  const onClick_ = (e: MouseEvent<HTMLElement>) => {
    onClick?.(e);
    setEnabled(false);

    if (!animate) {
      onDismiss?.(index);
    }
  };

  const onMouseEnter_ = (e: MouseEvent<HTMLElement>) => {
    onMouseEnter?.(e);

    if (!pausable) {
      return;
    }

    setPaused(true);
    setRemaining(remaining - (Date.now() - startTimeRef.current));
  };

  const onMouseLeave_ = (e: MouseEvent<HTMLElement>) => {
    onMouseLeave?.(e);

    if (!pausable) {
      return;
    }

    startTimeRef.current = Date.now();
    setPaused(false);
  };

  const content = (
    <Tag
      ref={innerRef}
      className={classNames('junipero toast', className)}
      onClick={onClick_}
      onMouseEnter={onMouseEnter_}
      onMouseLeave={onMouseLeave_}
      { ...rest }
    >
      { children }
      { lifespan > 0 && (
        <div
          className="countdown"
          style={{
            animationDuration: `${lifespan}ms`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      ) }
    </Tag>
  );

  return animate ? animate(content, { opened: enabled, index }) as JSX.Element
    : content;
}) as ForwardedProps<ToastRef, ToastProps>;

Toast.displayName = 'Toast';

export default Toast;
