import {
  type RefObject,
  type ReactNode,
  Children,
  useMemo,
  useImperativeHandle,
  useRef,
  useCallback,
} from 'react';
import { Slot } from '@radix-ui/react-slot';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import Step, { type StepObject } from '../Step';

export declare interface StepperRef extends JuniperoRef {
  active: number;
  steps: StepObject[];
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface StepperProps
  extends SpecialComponentPropsWithRef<'div', StepperRef> {
  active?: number;
  steps?: StepObject[];
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

  const getStepStatus = useCallback((i: number) => {
    switch (true) {
      case i < active:
        return 'completed';
      case i === active:
        return 'active';
      default:
        return null;
    }
  }, [active]);

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
    )) : Children.toArray(children).map((t, i) => (
      <Slot
        // @ts-expect-error cannot change SlotProps type
        status={getStepStatus(i)}
        key={i}
      >
        { t }
      </Slot>
    ))
  ), [steps, children, icon, getStepStatus]);

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
