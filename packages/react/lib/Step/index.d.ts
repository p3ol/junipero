import {
  ReactNode,
  ComponentPropsWithRef,
  MutableRefObject,
} from 'react';

export declare interface StepObject {
  title: ReactNode | JSX.Element;
  content: ReactNode | JSX.Element;
  icon: ReactNode | JSX.Element;
}

export declare type StepRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface StepProps extends ComponentPropsWithRef<any> {
  title?: string;
  icon?: ReactNode | JSX.Element;
  ref?: MutableRefObject<StepRef | undefined>;
}

declare function Step(props: StepProps): ReactNode | JSX.Element;

export default Step;
