import {
  type RefObject,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type ReactElement,
  Children,
  cloneElement,
  useMemo,
  useImperativeHandle,
  useRef,
} from 'react';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import Step, { type StepObject } from '../Step';

export declare interface StepperRef extends JuniperoRef {
  active: number;
  steps: Array<StepObject>;
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface StepperProps
  extends SpecialComponentPropsWithRef<'div', StepperRef> {
  active?: number;
  steps?: Array<StepObject>;
  icon?: ReactNode;
}

const Stepper = ({
  ref,
  active,
  steps,
  children,
  icon,
  ...rest
}: StepperProps) => {
  const innerRef = useRef<HTMLDivElement>(null);

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
    )) : Children.toArray(children).map((
      t: ReactElement<ComponentPropsWithoutRef<any>>,
      i: number
    ) => (
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
};

Stepper.displayName = 'Stepper';

export default Stepper;
