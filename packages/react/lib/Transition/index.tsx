import {
  type ComponentPropsWithRef,
  type ReactNode,
  Children,
  useState,
  useRef,
  useCallback,
  cloneElement,
} from 'react';
import { useTimeout, useLayoutEffectAfterMount } from '@junipero/hooks';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

export const TRANSITION_STATE_UNMOUNTED = 'unmounted';
export const TRANSITION_STATE_ENTER = 'enter';
export const TRANSITION_STATE_EXIT = 'exit';
export const TRANSITION_STATE_IDLE = 'idle';
export const TRANSITION_STATE_STARTING = 'starting';
export const TRANSITION_STATE_ACTIVE = 'active';
export const TRANSITION_STATE_DONE = 'done';

export declare type TransitionTimeoutObject = {
  enter?: number;
  exit?: number;
};

export declare interface TransitionProps extends ComponentPropsWithRef<any> {
  children?: JSX.Element | string | ReactNode;
  in: boolean;
  mounterOnEnter?: boolean;
  name?: string;
  timeout?: number | TransitionTimeoutObject;
  unmountOnExit?: boolean;
  onEnter?(): void;
  onEntering?(): void;
  onEntered?(): void;
  onExit?(): void;
  onExiting?(): void;
  onExited?(): void;
}

const Transition = ({
  children,
  in: inProp,
  name = 'transition',
  timeout = 100,
  mountOnEnter = true,
  unmountOnExit = false,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  ...rest
}: TransitionProps) => {
  const previousIn = useRef(inProp);
  const [status, setStatus] = useState(
    inProp ? TRANSITION_STATE_ENTER : TRANSITION_STATE_UNMOUNTED
  );
  const [step, setStep] = useState(
    inProp ? TRANSITION_STATE_STARTING : TRANSITION_STATE_IDLE
  );

  useLayoutEffectAfterMount(() => {
    if (inProp === previousIn.current) {
      return;
    }

    previousIn.current = inProp;
    setStatus(inProp ? TRANSITION_STATE_ENTER : TRANSITION_STATE_EXIT);
    inProp ? onEnter?.() : onExit?.();
    setStep(TRANSITION_STATE_STARTING);
  }, [inProp]);

  useTimeout(() => {
    setStep(TRANSITION_STATE_ACTIVE);
    status === TRANSITION_STATE_ENTER ? onEntering?.() : onExiting?.();
  }, 0, [step, status], { enabled: step === TRANSITION_STATE_STARTING });

  useTimeout(() => {
    if (step !== TRANSITION_STATE_IDLE) {
      setStep(TRANSITION_STATE_DONE);
      onEntered?.();
    }
  },
  (timeout as TransitionTimeoutObject)?.enter ?? (timeout as number),
  [status, step],
  { enabled: status === TRANSITION_STATE_ENTER });

  useTimeout(() => {
    if (step !== TRANSITION_STATE_IDLE) {
      unmountOnExit && setStatus(TRANSITION_STATE_UNMOUNTED);
      setStep(TRANSITION_STATE_DONE);
      onExited?.();
    }
  },
  (timeout as TransitionTimeoutObject)?.exit ?? (timeout as number),
  [status, step],
  {
    enabled: status === TRANSITION_STATE_EXIT,
  });

  const getClassName = useCallback(() => (
    status === TRANSITION_STATE_UNMOUNTED ? '' : (
      name + '-' + status + (
        ![TRANSITION_STATE_IDLE, TRANSITION_STATE_STARTING].includes(step)
          ? '-' + step
          : ''
      )
    )
  ), [status, step]);

  const child = Children.only(children);

  return status !== TRANSITION_STATE_UNMOUNTED && (
    !unmountOnExit || mountOnEnter
  ) ? cloneElement(child as JSX.Element, {
      className: classNames(
        (child as JSX.Element).props?.className, getClassName()
      ),
      ...rest,
    }) : null;
};

Transition.displayName = 'Transition';
Transition.propTypes = {
  in: PropTypes.bool.isRequired,
  name: PropTypes.string,
  timeout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      enter: PropTypes.number,
      exit: PropTypes.number,
    }),
  ]),
  mountOnEnter: PropTypes.bool,
  unmountOnExit: PropTypes.bool,
  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExiting: PropTypes.func,
  onExited: PropTypes.func,
};

export default Transition;
