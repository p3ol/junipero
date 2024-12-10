import {
  type ReactNode,
  type ElementType,
  type MouseEvent,
  useState,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import type { TransitionProps } from '../Transition';

export declare interface ToastRef extends JuniperoRef {
  enabled: boolean;
  paused: boolean;
  remaining: number;
}

export declare interface ToastObject {
  animationTimeout?: number;
  content?: ReactNode;
  duration?: number;
  index?: string | number;
  lifespan?: number;
  animate?(
    alert: ReactNode,
    opts: {
      opened: boolean;
      index: string | number;
    } & Partial<TransitionProps>,
  ): ReactNode;
  onDismiss?(index?: string | number): any;
}

export declare interface ToastProps
  extends SpecialComponentPropsWithRef<'div', ToastRef> {
  animationTimeout?: number;
  index?: string | number;
  lifespan?: number;
  pausable?: boolean;
  tag?: string | ElementType;
  animate?(
    alert: ReactNode,
    opts?: {
      opened: boolean;
      index: string | number;
    } & Partial<TransitionProps>,
  ): ReactNode;
  onDismiss?(index?: string | number): any;
}

const Toast = ({
  ref,
  index,
  children,
  className,
  tag: Tag = 'div',
  animationTimeout = 100,
  pausable = true,
  lifespan = 0,
  animate,
  onClick,
  onDismiss,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: ToastProps) => {
  const timeout = animate ? animationTimeout : 0;
  const innerRef = useRef<HTMLElement>(null);
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

  const onClick_ = (e: MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    setEnabled(false);

    if (!animate) {
      onDismiss?.(index);
    }
  };

  const onMouseEnter_ = (e: MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(e);

    if (!pausable) {
      return;
    }

    setPaused(true);
    setRemaining(remaining - (Date.now() - startTimeRef.current));
  };

  const onMouseLeave_ = (e: MouseEvent<HTMLDivElement>) => {
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

  return animate ? animate(content, { opened: enabled, index })
    : content;
};

Toast.displayName = 'Toast';

export default Toast;
