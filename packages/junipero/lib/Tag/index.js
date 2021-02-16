import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Tag = ({ value, className }) => {
  return (
    <span className={classNames('junipero', 'tag', className)} >{value}</span>
  );
};

export default Tag;

Tag.propTypes = {
  value: PropTypes.string,
};
