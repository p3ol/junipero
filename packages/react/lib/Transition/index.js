import { Children, useState, useCallback, cloneElement } from 'react';
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
  ...rest
}) => {
  const [status, setStatus] = useState(inProp ? ENTER : UNMOUNTED);
  const [step, setStep] = useState(inProp ? STARTING : IDLE);

  useLayoutEffectAfterMount(() => {
    setStatus(inProp ? ENTER : EXIT);
    setStep(STARTING);
  }, [inProp]);

  useTimeout(() => {
    setStep(ACTIVE);
  }, 0, [step], { enabled: step === STARTING });

  useTimeout(() => {
    if (step !== IDLE) {
      setStep(DONE);
    }
  }, timeout?.enter ?? timeout, [status, step], {
    enabled: status === ENTER,
  });

  useTimeout(() => {
    if (step !== IDLE) {
      setStatus(UNMOUNTED);
      setStep(DONE);
    }
  }, timeout?.exit ?? timeout, [status, step], {
    enabled: status === EXIT,
  });

  const getClassName = useCallback(() => (
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
  in: PropTypes.bool,
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
};

export default Transition;
