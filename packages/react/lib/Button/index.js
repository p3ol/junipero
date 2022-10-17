import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

const Button = forwardRef(({
  className,
  disabled,
  tag: Tag = 'button',
  onClick,
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const onClick_ = e => {
    if (disabled) {
      e.preventDefault();

      return;
    }

    onClick?.(e);
  };

  return (
    <Tag
      { ...rest }
      disabled={disabled}
      className={classNames('junipero', 'button', { disabled }, className)}
      ref={innerRef}
      onClick={onClick_}
    />
  );
});

Button.displayName = 'Button';
Button.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default Button;
