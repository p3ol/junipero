import {
  forwardRef,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

import { DropdownContext } from '../contexts';

const DropdownToggle = forwardRef(({
  tag: Tag = 'a',
  className,
  trigger = 'click',
  onClick = () => {},
  ...rest
}, ref) => {
  const { disabled, toggle } = useContext(DropdownContext);

  const onClick_ = e => {
    e?.preventDefault();

    if (disabled || trigger === 'manual') {
      return;
    }

    toggle();
    onClick(e);
  };

  return (
    <Tag
      href="#"
      { ...rest }
      className={classNames(
        'junipero',
        'dropdown-toggle',
        className,
      )}
      ref={ref}
      onClick={onClick_}
    />
  );
});

DropdownToggle.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  trigger: PropTypes.oneOf(['click', 'manual']),
  onClick: PropTypes.func,
};

export default DropdownToggle;
