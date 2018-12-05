import React from 'react';
import PropTypes from 'prop-types';

import { omit, classNames } from '../utils';

class Tab extends React.Component {

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    key: PropTypes.number,
    className: PropTypes.string,
    animate: PropTypes.func,
  }
  static defaultProps = {
    title: 'Tab',
    key: 0,
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
      ></div>
    );
  }
}


export default Tab;
