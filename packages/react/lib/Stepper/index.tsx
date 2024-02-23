import {
  cloneElement,
  forwardRef,
  useMemo,
  useImperativeHandle,
  useRef,
  MutableRefObject,
  ComponentPropsWithRef,
  ReactNode,
} from 'react';
import PropTypes from 'prop-types';

import Step, { StepObject } from '../Step';
import { ForwardedProps } from '../utils';

export declare type StepperRef = {
  active: number;
  steps: Array<StepObject>;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface StepperProps extends ComponentPropsWithRef<any> {
  active?: number;
  steps?: Array<StepObject>;
  icon?: ReactNode | JSX.Element;
  ref?: MutableRefObject<StepperRef | undefined>;
}

const Stepper = forwardRef(({
  active,
  steps,
  children,
  icon,
  ...rest
}: StepperProps, ref) => {

  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    steps,
    active,
    icon,
    isJunipero: true,
    innerRef,
  }));

  const getStepStatus = (i: number) => {
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
      )) : children.map((t: StepObject, i: number) =>
        cloneElement<StepObject>(t, { status: getStepStatus(i), key: i }
        ))
  ), [steps, children]);

  return (
    <div {...rest} ref={innerRef}>
      <div className="junipero stepper">
        { availableSteps }
      </div>
    </div>
  );
}) as ForwardedProps<StepperProps, StepperRef>;

Stepper.displayName = 'Stepper';
Stepper.propTypes = {
  active: PropTypes.number,
  steps: PropTypes.arrayOf(PropTypes.exact({
    title: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    icon: PropTypes.node.isRequired,
  }).isRequired),
  icon: PropTypes.node,
};

export default Stepper;
