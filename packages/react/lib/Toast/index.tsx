import {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
  ReactNode,
  ComponentPropsWithRef,
  ElementType,
  MutableRefObject,
} from 'react';
import { classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';
import PropTypes from 'prop-types';

import { ForwardedProps } from '../utils';

export declare type ToastRef = {
  enabled: boolean;
  isJunipero: boolean;
  paused: boolean;
  remaining: number;
  innerRef: MutableRefObject<any>;
};

export declare interface ToastObject {
  animationTimeout?: number;
  content?: ReactNode | JSX.Element;
  duration?: number;
  index?: string | number;
  lifespan?: number;
  animate?(
    alert: Element | JSX.Element,
    opts: { opened: boolean; index: string | number }
  ):Element | JSX.Element;
  onDismiss?(index?: string | number): any;
}

export declare interface ToastProps extends ComponentPropsWithRef<any> {
  animationTimeout?: number;
  children?: ReactNode | JSX.Element;
  className?: string;
  index?: string | number;
  lifespan?: number;
  tag?: string | ElementType;
  animate?(
    alert: ReactNode | Element | JSX.Element,
    opts?: { opened: boolean; index: string | number }
  ): Element | JSX.Element;
  onDismiss?(index?: string | number): any;
  ref?: MutableRefObject<ToastRef | undefined>;
}
const Toast = forwardRef(({
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
}: ToastProps, ref) => {
  const timeout = animate ? animationTimeout : 0;
  const innerRef = useRef();
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

  const onClick_ = e => {
    onClick?.(e);
    setEnabled(false);

    if (!animate) {
      onDismiss?.(index);
    }
  };

  const onMouseEnter_ = e => {
    onMouseEnter?.(e);

    if (!pausable) {
      return;
    }

    setPaused(true);
    setRemaining(remaining - (Date.now() - startTimeRef.current));
  };

  const onMouseLeave_ = e => {
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
}) as ForwardedProps<ToastProps, ToastRef>;

Toast.displayName = 'Toast';
Toast.propTypes = {
  index: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  lifespan: PropTypes.number,
  animate: PropTypes.func,
  animationTimeout: PropTypes.number,
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
  ]),
  pausable: PropTypes.bool,
  onDismiss: PropTypes.func,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default Toast;
