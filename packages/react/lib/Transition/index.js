import { Children, useState, useRef, useCallback, cloneElement } from 'react';
import { useTimeout, useLayoutEffectAfterMount } from '@junipero/hooks';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

const UNMOUNTED = 'unmounted';
const ENTER = 'enter';
const EXIT = 'exit';
const IDLE = 'idle';
const STARTING = 'starting';
const ACTIVE = 'active';
const DONE = 'done';

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
}) => {
  const previousIn = useRef(inProp);
  const [status, setStatus] = useState(inProp ? ENTER : UNMOUNTED);
  const [step, setStep] = useState(inProp ? STARTING : IDLE);

  useLayoutEffectAfterMount(() => {
    if (inProp === previousIn.current) {
      return;
    }

    previousIn.current = inProp;
    setStatus(inProp ? ENTER : EXIT);
    inProp ? onEnter?.() : onExit?.();
    setStep(STARTING);
  }, [inProp]);

  useTimeout(() => {
    setStep(ACTIVE);
    status === ENTER ? onEntering?.() : onExiting?.();
  }, 0, [step, status], { enabled: step === STARTING });

  useTimeout(() => {
    if (step !== IDLE) {
      setStep(DONE);
      onEntered?.();
    }
  }, timeout?.enter ?? timeout, [status, step], {
    enabled: status === ENTER,
  });

  useTimeout(() => {
    if (step !== IDLE) {
      unmountOnExit && setStatus(UNMOUNTED);
      setStep(DONE);
      onExited?.();
    }
  }, timeout?.exit ?? timeout, [status, step], {
    enabled: status === EXIT,
  });

  const getClassName = useCallback(() => status === UNMOUNTED ? '' : (
    name + '-' + status + (![IDLE, STARTING].includes(step) ? '-' + step : '')
  ), [status, step]);

  const child = Children.only(children);

  return status !== UNMOUNTED && (!unmountOnExit || mountOnEnter)
    ? cloneElement(child, {
      className: classNames(child.props.className, getClassName()),
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
