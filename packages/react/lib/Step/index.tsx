import {
  type ComponentPropsWithoutRef,
  type MutableRefObject,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type { JuniperoRef } from '../types';
import { Check } from '../icons';

export declare interface StepObject {
  title: ReactNode | JSX.Element;
  content: ReactNode | JSX.Element;
  icon?: ReactNode | JSX.Element;
}

export declare interface StepRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLDivElement>;
}

export declare interface StepProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  title?: ReactNode | JSX.Element;
  icon?: ReactNode | JSX.Element;
  status?: 'completed' | 'active' | 'none';
}

const Step = forwardRef<StepRef, StepProps>(({
  title,
  icon,
  children,
  status,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLDivElement>();

  useImperativeHandle(ref, () => ({
    isJunipero: true,
    innerRef,
  }));

  return (
    <div { ...rest } ref={innerRef} className={classNames('step', status)}>
      <div className="content">
        <div className="step-icon">
          { status === 'completed' && (icon || <Check />) }
        </div>
        <div className="junipero extra step-details">
          <span>{ title }</span>
          <span className="junipero secondary name">{ children }</span>
        </div>
      </div>
    </div>
  );
});

Step.displayName = 'Step';

export default Step;
