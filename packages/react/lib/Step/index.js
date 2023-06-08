import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/react';
import PropTypes from 'prop-types';

const Step = forwardRef(({ title, icon, children, status, ...rest }, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    isJunipero: true,
    innerRef,
  }));

  return (
    <div ref={innerRef} className="step" {...rest}>
      <div className="content">
        <div
          className={classNames(
            'circle',
            status,
            (icon && status === 'completed') && 'with-icon',
          )}
        >
          { (icon && status === 'completed') && icon}
        </div>
        <div className={classNames(
          'details',
          status,
        )}
        >
          <span>{ title }</span>
          <span className="name">{children}</span>
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
