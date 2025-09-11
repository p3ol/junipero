import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Button = forwardRef(({
  className,
  disabled = false,
  tag: Tag = 'button',
  onClick = () => {},
  ...rest
}, ref) => {
  const onClick_ = e => {
    if (disabled) {
      return;
    }

    onClick(e);
  };

  return (
    <Tag
      { ...rest }
      ref={ref}
      className={classNames(
        'junipero',
        'button',
        { disabled },
        className,
      )}
      onClick={onClick_}
      disabled={disabled}
      role="button"
      aria-disabled={disabled}
    />
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
