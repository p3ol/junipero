import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles, classNames } from './utils';
import styles from './theme/components/BreadCrumb.styl';

class BreadCrumb extends React.Component {

  static propTypes = {
    items: PropTypes.array,
    theme: PropTypes.string,
    animateItem: PropTypes.func,
  }

  static defaultProps = {
    items: [],
    theme: 'default',
    animateItem: item => item,
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-bread-crumb-styles', after: '#junipero-main-styles' });
  }

  render() {
    const { items, className, theme, animateItem, ...rest } = this.props;

    return (
      <div
        { ...rest }
        className={classNames(
          'junipero',
          'junipero-bread-crumb',
          'theme-' + theme,
          className,
        )}
      >
        {items.map((item, index) =>
          animateItem(<span key={index}>{item}</span>, index)
        )}
      </div>
    );
  }
}

export default BreadCrumb;
