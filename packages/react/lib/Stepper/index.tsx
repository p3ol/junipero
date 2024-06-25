import {
  type MutableRefObject,
  type ComponentPropsWithoutRef,
  type ReactNode,
  Children,
  cloneElement,
  forwardRef,
  useMemo,
  useImperativeHandle,
  useRef,
} from 'react';

import type { JuniperoRef } from '../types';
import Step, { type StepObject } from '../Step';

export declare interface StepperRef extends JuniperoRef {
  active: number;
  steps: Array<StepObject>;
  innerRef: MutableRefObject<HTMLDivElement>;
}

export declare interface StepperProps extends ComponentPropsWithoutRef<'div'> {
  active?: number;
  steps?: Array<StepObject>;
  icon?: ReactNode | JSX.Element;
}

const Stepper = forwardRef<StepperRef, StepperProps>(({
  active,
  steps,
  children,
  icon,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLDivElement>();

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
        return null;
    }
  };

  const availableSteps = useMemo(() => (
    steps ? steps.map((t, i) => (
      <Step
        status={getStepStatus(i)}
        key={i}
        title={t.title}
        icon={t.icon || icon}
      >
        { t.content }
      </Step>
    )) : Children.toArray(children).map((t: JSX.Element, i: number) => (
      cloneElement(t, { status: getStepStatus(i), key: i })
    ))
  ), [steps, children]);

  return (
    <div { ...rest } ref={innerRef}>
      <div className="junipero stepper">
        { availableSteps }
      </div>
    </div>
  );
});

Stepper.displayName = 'Stepper';

export default Stepper;
