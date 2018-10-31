import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles } from '../utils';
import styles from '../theme/components/BreadCrumb.styl';

class BreadCrumb extends React.Component {

  static propTypes = {
    items: PropTypes.array,
  }

  static defaultProps = {
    items: [],
  }

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

export default BreadCrumb;
