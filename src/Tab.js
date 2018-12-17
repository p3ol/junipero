import React from 'react';
import PropTypes from 'prop-types';

import { omit, classNames } from './utils';

class Tab extends React.Component {

  static propTypes = {
    key: PropTypes.number,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    animate: PropTypes.func,
  }
  static defaultProps = {
    key: 0,
    title: 'Tab',
    animate: tab => tab,
  }

  render() {
    const { className, animate, ...rest } = this.props;

    return animate(
      <div
        { ...omit(rest, [
          'title', 'key',
        ])}
        className={classNames(
          'junipero',
          'junipero-tab',
          className,
        )}
      />
    );
  }
}

export default Tab;
