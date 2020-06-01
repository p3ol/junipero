import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useContext,
} from 'react';
import PropTypes from 'prop-types';

import { classNames } from '../utils';
import { DropdownContext } from '../contexts';

const DropdownToggle = forwardRef(({
  tag: Tag = 'a',
  className,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const { disabled, toggle } = useContext(DropdownContext);

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  const onClick_ = e => {
    e?.preventDefault();

    if (disabled) {
      return;
    }

    toggle();
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
      ref={innerRef}
      onClick={onClick_}
    />
  );
});

DropdownToggle.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};

export default DropdownToggle;
