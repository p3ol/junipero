import React from 'react';
import PropTypes from 'prop-types';

import { classNames } from '../utils';

const BreadCrumb = ({
  className,
  items = [],
  itemTag: Item = 'span',
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
      animateItem(<Item className="item" key={index}>{item}</Item>, index)
    ) }
  </div>
);

BreadCrumb.propTypes = {
  items: PropTypes.array,
  itemTag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
  animateItem: PropTypes.func,
};

export default BreadCrumb;
