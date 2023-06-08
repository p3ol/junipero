import {
  cloneElement,
  forwardRef,
  useMemo,
  useImperativeHandle,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import Step from '../Step';

const Stepper = forwardRef(({
  active,
  steps,
  children,
  icon,
  ...rest
}, ref) => {

  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    steps,
    active,
    icon,
    isJunipero: true,
    innerRef,
  }));

  const getStepStatus = i => {
    switch (true) {
      case i < active:
        return 'completed';
      case i === active:
        return 'active';
      default:
        return '';
    }
  };

  const availableSteps = useMemo(() => (
    steps
      ? steps.map((t, i) => (
        <Step
          status={getStepStatus(i)}
          key={i}
          title={t.title}
          icon={t.icon || icon}
        >
          { t.content }
        </Step>
      )) : children.map((t, i) =>
        cloneElement(t, { status: getStepStatus(i), key: i }
        ))
  ), [steps, children]);

  return (
    <div {...rest} ref={innerRef}>
      <div className="junipero stepper">
        { availableSteps }
      </div>
    </div>
  );
});

Stepper.displayName = 'Stepper';
Stepper.propTypes = {
  active: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  steps: PropTypes.arrayOf(PropTypes.object),
  icon: PropTypes.node,
};

export default Stepper;
