import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

import { StepObject } from '../Step';

export declare type StepperRef = {
  active: number;
  steps: Array<StepObject>;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface StepperProps extends ComponentPropsWithRef<any> {
  active?: number;
  steps?: Array<StepObject>;
  icon: ReactNode | JSX.Element;
  ref?: MutableRefObject<StepperRef | undefined>;
}

declare function Stepper(props: StepperProps): ReactNode | JSX.Element;

export default Stepper;
