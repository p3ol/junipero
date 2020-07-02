import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Button = forwardRef(({
  children,
  className,
  disabled = false,
  tag: Tag = 'button',
  onClick = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  const onClick_ = e => {
    if (disabled) {
      return;
    }

    onClick(e);
  };

  return (
    <Tag
      { ...rest }
      className={classNames(
        'junipero',
        'button',
        { disabled },
        className,
      )}
      ref={innerRef}
      onClick={onClick_}
      disabled={disabled}
    >
      { children }
    </Tag>
  );
});

Button.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  tag: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default Button;
