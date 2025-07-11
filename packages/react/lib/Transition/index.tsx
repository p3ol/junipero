import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  cloneElement,
  useState,
  useRef,
  useCallback,
} from 'react';
import { useTimeout, useLayoutEffectAfterMount } from '@junipero/hooks';
import { classNames } from '@junipero/core';

export const TRANSITION_STATE_UNMOUNTED = 'unmounted';
export const TRANSITION_STATE_ENTER = 'enter';
export const TRANSITION_STATE_EXIT = 'exit';
export const TRANSITION_STATE_IDLE = 'idle';
export const TRANSITION_STATE_STARTING = 'starting';
export const TRANSITION_STATE_ACTIVE = 'active';
export const TRANSITION_STATE_DONE = 'done';

export declare interface TransitionTimeoutObject {
  enter?: number;
  exit?: number;
}

export declare interface TransitionProps
  extends ComponentPropsWithoutRef<any> {
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

    if (inProp) {
      onEnter?.();
    } else {
      onExit?.();
    }

    setStep(TRANSITION_STATE_STARTING);
  }, [inProp]);

  useTimeout(() => {
    setStep(TRANSITION_STATE_ACTIVE);

    if (status === TRANSITION_STATE_ENTER) {
      onEntering?.();
    } else {
      onExiting?.();
    }
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
      if (unmountOnExit) {
        setStatus(TRANSITION_STATE_UNMOUNTED);
      }

      setStep(TRANSITION_STATE_DONE);
      onExited?.();
    }
  },
  (timeout as TransitionTimeoutObject)?.exit ?? (timeout as number),
  [status, step],
  { enabled: status === TRANSITION_STATE_EXIT });

  const getClassName = useCallback(() => (
    status === TRANSITION_STATE_UNMOUNTED ? '' : (
      name + '-' + status + (
        ![TRANSITION_STATE_IDLE, TRANSITION_STATE_STARTING].includes(step)
          ? '-' + step
          : ''
      )
    )
  ), [status, step, name]);

  const child: ReactElement<
    ComponentPropsWithoutRef<any>
  > = typeof children !== 'string' && Array.isArray(children)
    ? children[0] : children;

  return status !== TRANSITION_STATE_UNMOUNTED && (
    !unmountOnExit || mountOnEnter
  ) ? cloneElement(child, {
      className: classNames(
        child.props?.className, getClassName()
      ),
      ...rest,
    }) : null;
};

Transition.displayName = 'Transition';

export default Transition;
