import React, {
  forwardRef,
  useRef,
  useReducer,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';

import { classNames, mockState } from '../utils';
import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';

const DateTimeField = forwardRef(({
  className,
  value,
  required = false,
}, ref) => {
  const innerRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    value,
    valid: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  return (
    <div
      className={classNames(
        'junipero',
        'field',
        'date-time-picker',
      )}
      ref={innerRef}
    >
      <Dropdown>
        <DropdownToggle>

        </DropdownToggle>
      </Dropdown>
    </div>
  );
});

DateTimeField.propTypes = {
  required: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
};

export default DateTimeField;
