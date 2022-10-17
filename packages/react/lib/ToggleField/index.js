import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ToggleField = forwardRef(({
  checked = false,
}, ref) => {
  console.log(checked);

  return (
    <div>coucou</div>
  );
});

ToggleField.displayName = 'ToggleField';
ToggleField.propTypes = {
  value: PropTypes.any,
  checked: PropTypes.bool,
};
export default ToggleField;
