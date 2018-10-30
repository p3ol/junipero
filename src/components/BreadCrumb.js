import React from 'react';
import PropTypes from 'prop-types';

import '../theme/components/BreadCrumb.styl';

const propTypes = {
  items: PropTypes.array,
};

const defaultProps = {
  items: [],
};

const BreadCrumb = ({ items }) => (
  <div className="junipero bread-crumb">
    {items.map((item, index) =>
      <span key={index}>{item}</span>
    )}
  </div>
);

BreadCrumb.propTypes = propTypes;
BreadCrumb.defaultProps = defaultProps;

export default BreadCrumb;
