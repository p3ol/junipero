import React from 'react';
import PropTypes from 'prop-types';

import { classNames } from '../utils';

const BreadCrumb = ({
  className,
  items = [],
  animateItem = item => item,
  ...rest
}) => (
  <div
    { ...rest }
    className={classNames(
      'junipero',
      'breadcrumb',
      className,
    )}
  >
    { items.map((item, index) =>
      animateItem(<span key={index}>{item}</span>, index)
    ) }
  </div>
);

BreadCrumb.propTypes = {
  items: PropTypes.array,
  animateItem: PropTypes.func,
};

export default BreadCrumb;
