import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

const Badge = forwardRef(({
  className,
  tag: Tag = 'span',
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    isJunipero: true,
    innerRef,
  }));

  return (
    <Tag
      { ...rest }
      ref={innerRef}
      className={classNames('junipero', 'badge', className)}
    />
  );
});

Badge.displayName = 'Badge';
Badge.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default Badge;
