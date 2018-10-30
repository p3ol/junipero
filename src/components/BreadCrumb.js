import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles } from '../utils';
import styles from '../theme/components/BreadCrumb.styl';

const propTypes = {
  items: PropTypes.array,
};

const defaultProps = {
  items: [],
};

class BreadCrumb extends React.Component {

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-bread-crumb-styles', after: '#junipero-main-styles' });
  }

  render() {
    const { items } = this.props;

    return (
      <div className="junipero bread-crumb">
        {items.map((item, index) =>
          <span key={index}>{item}</span>
        )}
      </div>
    );
  }
}

BreadCrumb.propTypes = propTypes;
BreadCrumb.defaultProps = defaultProps;

export default BreadCrumb;
