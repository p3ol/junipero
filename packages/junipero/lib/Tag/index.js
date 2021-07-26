import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Tag = forwardRef(({
  tag: Comp = 'span',
  className,
  ...rest
}, ref) => (
  <Comp
    { ...rest }
    ref={ref}
    className={classNames('junipero', 'tag', className)}
  />
));

Tag.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
};

export default Tag;
