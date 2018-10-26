import React from 'react';
import PropTypes from 'prop-types';

import '../theme/components/Breadcrumb.styl';

const propTypes = {
  items: PropTypes.array,
};
  
const defaultProps = {
  items: [],
};

class Breadcrumb extends React.Component {

  render() {
    return (
      <div className="junipero bread-crumb">
        {this.props.items.map((item, index) => 
          <a className={(this.props.items.length - 1) === index ?
            'last' : 'element' } 
          key={index}>
            {item}
          </a>
        )}
      </div>
    );
  }

}

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;