import React from 'react';
import PropTypes from 'prop-types';

class Tab extends React.Component {

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    key: PropTypes.number,
  }
  static defaultProps = {
    title: 'Tab',
    key: 0,
  }

  render() {
    return (
      <div className="junipero tab">
        { this.props.children }
      </div>
    );
  }
}


export default Tab;
