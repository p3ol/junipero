import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Tag = ({ className, children, ...rest }) => (
  <span {...rest} className={classNames('junipero', 'tag', className)}>
    {children}
  </span>
);

Tag.propTypes = {
  children: PropTypes.node,
};

export default Tag;
