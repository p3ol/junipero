import { useReducer, useEffect, useRef, useLayoutEffect } from 'react';
import { classNames, mockState, exists } from '@junipero/core';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';
import { Arrows, Remove } from '../icons';
import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownGroup from '../DropdownGroup';
import DropdownItem from '../DropdownItem';
import Tag from '../Tag';

const SelectField = ({
  className,
  options,
  placeholder,
  value,
  valid,
  disabled = false,
  multiple = false,
  required = false,
  onChange,
  parseTitle = val => val?.toString?.(),
  parseValue = val => val,
  onValidate = (val, { required }) => !!val || !required,
  ...rest
}) => {
  const dropdownRef = useRef();
  const searchInputRef = useRef();
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState, {
    value,
    valid: valid ?? false,
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

  useLayoutEffect(() => {
    if (!searchInputRef.current) {
      return;
    }

    searchInputRef.current.size = searchInputRef.current.placeholder.length;
  }, [placeholder]);

  const onChange_ = ({ close = true } = {}) => {
    dispatch({ value: state.value, valid: state.valid, dirty: true });
    onChange?.({ value: parseValue(state.value), valid: state.valid });
    updateControl?.({ valid: state.valid, dirty: true });
    close && dropdownRef.current?.close?.();
  };

  const onSelectOption = option => {
    if (disabled) {
      return;
    }

    if (!multiple) {
      state.value = option;
    } else {
      state.value = Array.isArray(state.value)
        ? state.value.concat(option)
        : [].concat(state.value ?? [], option);
    }

    state.valid = onValidate(parseValue(state.value), { required });
    onChange_();
  };

  const onRemoveOption = option => {
    if (disabled || !multiple || !Array.isArray(state.value)) {
      return;
    }

    state.value = state.value.filter(val => val !== option);
    state.valid = onValidate(parseValue(state.value), { required });
    onChange_({ close: false });
  };

  const onClear = e => {
    e.stopPropagation();

    if (multiple) {
      state.value = [];
    } else {
      state.value = value;
    }

    state.valid = onValidate(parseValue(state.value), { required });
    onChange_({ close: false });
  };

  const onSearch = e => {
    dispatch({ search: e.target.value });
  };

  const onFocusField = e => {
    e.preventDefault();
    searchInputRef.current?.focus();
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

  const filterUsedOptions = opts => multiple && Array.isArray(state.value)
    ? opts.filter(opt => !state.value.includes(opt))
    : opts;

  const renderGroup = (group, i) => {
    const opts = filterUsedOptions(group.options);

    if (!opts.length) {
      return null;
    }

    return (
      <DropdownGroup key={i} title={group.title}>
        { opts.map((o, n) => renderOption(o, n)) }
      </DropdownGroup>
    );
  };

  const renderOption = (item, i) => (
    <DropdownItem key={i}>
      <a onClick={onSelectOption.bind(null, item)}>{ parseTitle(item) }</a>
    </DropdownItem>
  );

  const hasValue = () =>
    !multiple && !!state.value;

  const hasTags = () =>
    multiple && Array.isArray(state.value) && state.value.length > 0;

  return (
    <Dropdown
      { ...rest }
      ref={dropdownRef}
      className={classNames('select-field', className)}
    >
      <DropdownToggle>
        <div className="field" onClick={onFocusField}>
          { hasValue() && (
            <input
              type="text"
              readOnly={true}
              value={parseTitle(state.value)}
            />
          ) }
          { hasTags() ? state.value.map((o, i) => (
            <Tag
              key={i}
              className="info"
              onDelete={onRemoveOption.bind(null, o)}
            >
              { parseTitle(o) }
            </Tag>
          )) : null }
          { (multiple || !state.value) && (
            <input
              type="text"
              value={state.search}
              placeholder={placeholder}
              onChange={onSearch}
              ref={searchInputRef}
            />
          ) }
          <div className="icons">
            { !!state.value && <Remove onClick={onClear} /> }
            <Arrows />
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu>
        { filterUsedOptions(options).map((o, i) => (
          o?.options ? renderGroup(o, i) : renderOption(o, i)
        )) }
      </DropdownMenu>
    </Dropdown>
  );
};

SelectField.displayName = 'SelectField';
SelectField.propTypes = {
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  valid: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
};

export default SelectField;
