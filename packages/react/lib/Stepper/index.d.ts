import { ReactNode, ComponentPropsWithRef } from 'react';

declare interface StepperProps extends ComponentPropsWithRef<any> {
  currentStep?: number;
  steps?: Array<object>;
  icon: ReactNode | JSX.Element;
}

declare function Stepper(props: StepperProps): ReactNode | JSX.Element;

export default Stepper;
