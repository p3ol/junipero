import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';

import { classNames, mockState } from '../utils';
import TextField from '../TextField';
import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownItem from '../DropdownItem';

const SelectField = forwardRef(({
  animateMenu,
  className,
  label,
  placeholder,
  value,
  autoFocus = false,
  disabled = false,
  options = [],
  required = false,
  onBlur = () => {},
  onChange = () => {},
  onFocus = () => {},
  onToggle = () => {},
  parseTitle = val => val?.toString(),
  parseValue = val => val,
  validate = val => !required || typeof val !== 'undefined',
}, ref) => {
  const innerRef = useRef();
  const dropdownRef = useRef();
  const fieldRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    value,
    opened: false,
    valid: false,
    dirty: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    dirty: state.dirty,
    internalValue: state.value,
    valid: state.valie,
    opened: state.opened,
    focus,
    blur,
    reset,
  }));

  const onToggle_ = ({ opened }) => {
    dispatch({ opened });
    onToggle({ opened });
  };

  const onFocus_ = e => {
    dropdownRef.current?.open();
    onFocus(e);
  };

  const onSelect_ = (option, e) => {
    if (e.key === 'Enter') {
      onChange_(option, e);
    }
  };

  const onChange_ = (option, e) => {
    e.preventDefault();
    state.value = option;
    state.valid = validate(parseValue(option));

    dispatch({ value: state.value, dirty: true, valid: state.valie });

    dropdownRef.current?.close();
    fieldRef.current?.setDirty(true);

    onChange({ value: parseValue(state.value), valid: state.valid });
  };

  const focus = () => {
    fieldRef.current?.focus();
    dropdownRef.current?.open();
  };

  const blur = () => {
    fieldRef.current?.blur();
    dropdownRef.current?.close();
  };

  const reset = () => {
    dispatch({
      value,
      valid: false,
      dirty: false,
    });

    fieldRef.current?.reset();
  };

  return (
    <div
      ref={innerRef}
      className={classNames(
        'junipero',
        'field',
        'select',
        className,
      )}
    >
      <Dropdown onToggle={onToggle_} disabled={disabled} ref={dropdownRef}>
        <DropdownToggle trigger="manual" href={null} tag="div">
          <TextField
            ref={fieldRef}
            disabled={disabled}
            placeholder={placeholder}
            label={label}
            value={parseTitle(state.value || '')}
            valid={state.valid}
            validate={() => state.valid}
            readOnly={true}
            autoFocus={autoFocus}
            onFocus={onFocus_}
            onBlur={onBlur}
          />
        </DropdownToggle>
        <DropdownMenu animate={animateMenu}>
          { options.map((o, index) => (
            <DropdownItem
              key={index}
              tabIndex={0}
              onKeyPress={onSelect_.bind(null, o)}
            >
              <a href="#" onClick={onChange_.bind(null, o)} tabIndex={-1}>
                { parseTitle(o) }
              </a>
            </DropdownItem>
          )) }
        </DropdownMenu>
      </Dropdown>
    </div>
  );
});

SelectField.propTypes = {
  autoFocus: PropTypes.bool,
  animateMenu: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
    PropTypes.bool,
  ]),
  options: PropTypes.array,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onToggle: PropTypes.func,
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  required: PropTypes.bool,
  validate: PropTypes.func,
  value: PropTypes.any,
};

export default SelectField;
