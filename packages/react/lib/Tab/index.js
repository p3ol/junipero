import { forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@junipero/core';

const Tab = forwardRef(({
  className,
  tag: Tag = 'div',
  title: _,
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <Tag
      { ...rest }
      className={classNames(
        'tab',
        className,
      )}
      ref={ref}
    />
  );
});

Tab.displayName = 'Tab';
Tab.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
};

export default Tab;
