import {
  type RefObject,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import { Check } from '../icons';

export declare interface StepObject {
  title: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
}

export declare interface StepRef extends JuniperoRef {
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface StepProps
  extends Omit<SpecialComponentPropsWithRef<'div', StepRef>, 'title'> {
  title?: ReactNode;
  icon?: ReactNode;
  status?: 'completed' | 'active' | 'none';
}

const Step = ({
  ref,
  title,
  icon,
  children,
  status,
  ...rest
}: StepProps) => {
  const innerRef = useRef<HTMLDivElement>(null);

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
};

Step.displayName = 'Step';

export default Step;
