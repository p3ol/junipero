import React from 'react';
import PropTypes from 'prop-types';

import './TextField.styl';

const propTypes = {
  type: PropTypes.string,
  pattern: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultProps = {
  type: 'text',
  pattern: '.+',
  onChange: () => {},
};

const TextField = (props) => (
  <div className="udf-text-field">
    <input
      type={props.type}
      onChange={(e) => {
        props.onChange({
          value: e.target.value,
          valid: (new RegExp(props.pattern, 'ig')).test(e.target.value),
        });
      }}
    />
  </div>
);

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;
