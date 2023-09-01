import { ComponentPropsWithRef, MutableRefObject, ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { Check } from '../icons';
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
const Step = forwardRef(
  ({ title, icon, children, status, ...rest }: StepProps, ref) => {
    const innerRef = useRef<any>();

    useImperativeHandle(ref, () => ({
      isJunipero: true,
      innerRef,
    }));

    return (
      <div ref={innerRef} className={classNames('step', status)} {...rest}>
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
  }) as ForwardedProps<StepProps, StepRef>;

Step.displayName = 'Step';
Step.propTypes = {
  title: PropTypes.string,
  status: PropTypes.string,
  icon: PropTypes.node,
};

export default Step;
