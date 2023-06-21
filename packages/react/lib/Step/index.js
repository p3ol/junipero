import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/react';
import PropTypes from 'prop-types';

import { Check } from '../icons';

const Step = forwardRef(({ title, icon, children, status, ...rest }, ref) => {
  const innerRef = useRef();

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
});

Step.displayName = 'Step';
Step.propTypes = {
  title: PropTypes.string,
  status: PropTypes.string,
  icon: PropTypes.node,
};

export default Step;
