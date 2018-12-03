import React from 'react';
import PropTypes from 'prop-types';

import { omit } from '../utils';

class Tab extends React.Component {

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    key: PropTypes.number,
    className: PropTypes.string,
  }
  static defaultProps = {
    title: 'Tab',
    key: 0,
  }

  render() {
    const { className, ...rest } = this.props;

    return (
      <div
        { ...omit(rest, [
          'title', 'key',
        ])}
        className={[
          'junipero',
          'junipero-tab',
          className,
        ].join(' ')}
      ></div>
    );
  }
}


export default Tab;
