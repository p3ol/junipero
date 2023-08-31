import { MutableRefObject, ComponentPropsWithRef, ReactNode } from 'react';
import { StepObject } from '../Step';
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
declare const Stepper: ForwardedProps<StepperProps, StepperRef>;
export default Stepper;
