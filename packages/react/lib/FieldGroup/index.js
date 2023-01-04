import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

const FieldGroup = forwardRef(({
  tag: Tag = 'div',
  className,
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <Tag
      className={classNames('junipero field-group', className)}
      ref={innerRef}
      { ...rest }
    />
  );
});

FieldGroup.displayName = 'FieldGroup';
FieldGroup.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]),
};

export default FieldGroup;
