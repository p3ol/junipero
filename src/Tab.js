import React from 'react';
import PropTypes from 'prop-types';

import { omit, classNames } from './utils';

export default class Tab extends React.Component {

  static propTypes = {
    key: PropTypes.number,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    animate: PropTypes.func,
  }

  static defaultProps = {
    key: 0,
    title: null,
    animate: tab => tab,
  }

  render () {
    const { className, key, animate, ...rest } = this.props;

    return animate((
      <div
        { ...omit(rest, [
          'title',
        ])}
        className={classNames(
          'junipero',
          'junipero-tab',
          className,
        )}
      />
    ), key);
  }
}
