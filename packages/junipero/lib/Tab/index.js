import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import { classNames } from '../utils';

const Tab = forwardRef(({
  className,
  title: _,
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  return (
    <div
      className={classNames(
        'junipero',
        'tab',
        className,
      )}
      ref={innerRef}
      { ...rest }
    />
  );
});

Tab.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
};

export default Tab;
