import React from 'react';
import PropTypes from 'prop-types';

import '../theme/components/CheckBox.styl';

const propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};

const defaultProps = {
  className: null,
  checked: false,
  label: '',
  disabled: false,
  required: false,
  onChange: () => {},
};

class CheckBox extends React.Component {

}

CheckBox.propTypes = propTypes;
CheckBox.defaultProps = defaultProps;

export default CheckBox;
