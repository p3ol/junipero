import { ComponentPropsWithRef, MutableRefObject, ReactNode } from 'react';
import { ForwardedProps } from '../utils';
export declare interface StepObject {
    title: ReactNode | JSX.Element;
    content: ReactNode | JSX.Element;
    icon?: ReactNode | JSX.Element;
}
export declare type StepRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
export declare interface StepProps extends ComponentPropsWithRef<any> {
    title?: ReactNode | JSX.Element;
    icon?: ReactNode | JSX.Element;
    ref?: MutableRefObject<StepRef | undefined>;
}
declare const Step: ForwardedProps<StepProps, StepRef>;
export default Step;
