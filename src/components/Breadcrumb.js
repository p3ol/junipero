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
    constructor(props) {
        super(props);
      }

    render() {
        return(
            <div className="junipero bread-crumb">
                {this.props.items.map((item, index) => 
                    <a className={(this.props.items.length - 1) === index ? 'last m-1' : 'element m-1' } 
                       key={index}>
                       { 0 === index ? item : `> ${item}`}
                     </a>
                )}
            </div>
        );
    }

}

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;