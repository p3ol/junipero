import { useReducer, useEffect, useRef } from 'react';
import { classNames, mockState, exists } from '@junipero/core';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownGroup from '../DropdownGroup';
import DropdownItem from '../DropdownItem';
import TextField from '../TextField';

const SelectField = ({
  className,
  options,
  value,
  required,
  parseTitle = val => val?.toString?.(),
  parseValue = val => val,
  onValidate = (val, { required }) => !!val || !required,
  ...rest
}) => {
  const [state, dispatch] = useReducer(mockState, {
    value,
    dirty: false,
  });

  useEffect(() => {
    if (exists(value)) {
      dispatch({
        value: findOption(options, value) || value,
        valid: onValidate(parseValue(value), { required }),
      });
    }
  }, [value, options]);

  const onSelectOption = option => {
    dispatch({ value: parseValue(option) });
  };

  const findOption = (stack = [], needle) => {
    for (const option of stack) {
      if (option.options) {
        return findOption(option.options, needle);
      } else if (parseValue(option) === parseValue(needle)) {
        return option;
      }
    }
  };

  const renderGroup = (group, i) => (
    <DropdownGroup key={i} title={group.title}>
      { group.options.map((o, n) => renderOption(o, n)) }
    </DropdownGroup>
  );

  const renderOption = (item, i) => (
    <DropdownItem key={i}>
      <a onClick={onSelectOption.bind(null, item)}>{ parseTitle(item) }</a>
    </DropdownItem>
  );

  return (
    <Dropdown
      { ...rest }
      className={classNames('select-field', className)}
    >
      <DropdownToggle>
        <TextField />
      </DropdownToggle>
      <DropdownMenu>
        { options.map((o, i) => (
          o?.options ? renderGroup(o, i) : renderOption(o, i)
        )) }
      </DropdownMenu>
    </Dropdown>
  );
};

SelectField.displayName = 'SelectField';
SelectField.propTypes = {
  options: PropTypes.array,
  required: PropTypes.bool,
  value: PropTypes.any,
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
  onValidate: PropTypes.func,
};

export default SelectField;
