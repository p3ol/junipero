import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Tag = forwardRef(({
  tag: Tag_ = 'span',
  className,
  ...rest
}, ref) => (
  <Tag_
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
