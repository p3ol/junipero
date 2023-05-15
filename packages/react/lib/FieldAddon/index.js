import { forwardRef, useImperativeHandle, useRef } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';

const FieldAddon = forwardRef(({
  tag: Tag = 'div',
  className,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const { focused } = useFieldControl();
  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <Tag
      className={classNames(
        'junipero field-addon',
        { focused },
        className,
      )}
      ref={innerRef}
      { ...rest }
    />
  );
});

FieldAddon.displayName = 'FieldAddon';
FieldAddon.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]),
};

export default FieldAddon;
