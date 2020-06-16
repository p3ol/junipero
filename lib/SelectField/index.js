import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';

import { classNames, mockState } from '../utils';
import { useTimeout, useEventListener } from '../hooks';
import TextField from '../TextField';
import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownItem from '../DropdownItem';

const SelectField = forwardRef(({
  search,
  searchLabel,
  animateMenu,
  className,
  label,
  placeholder,
  value,
  autoFocus = false,
  disabled = false,
  noItems = 'No items found :(',
  noSearchResults = 'No result found :(',
  options = [],
  required = false,
  searchPlaceholder = 'Search...',
  searchMinCharacters = 2,
  searchThreshold = 400,
  onBlur = () => {},
  onChange = () => {},
  onFocus = () => {},
  onToggle = () => {},
  parseTitle = val => val?.toString?.(),
  parseValue = val => val,
  validate = val => !required || typeof val !== 'undefined',
}, ref) => {
  const innerRef = useRef();
  const dropdownRef = useRef();
  const fieldRef = useRef();
  const searchFieldRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    value,
    searchValue: '',
    searchResults: null,
    searching: false,
    opened: false,
    valid: false,
    dirty: false,
    selectedIndex: null,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    dropdownRef,
    fieldRef,
    searchFieldRef,
    dirty: state.dirty,
    internalValue: state.value,
    valid: state.valid,
    opened: state.opened,
    searchValue: state.searchValue,
    searchResults: state.searchResults,
    searching: state.searching,
    focus,
    blur,
    reset,
  }));

  useEventListener('keydown', e => {
    onSelectionChange_(e);
  });

  useEffect(() => {
    if (disabled) {
      dropdownRef.current?.close();
    } else if (autoFocus) {
      dropdownRef.current?.open();
    }
  }, [disabled]);

  useEffect(() => {
    if (value && options) {
      dispatch({
        value: options.find(o => parseValue(o) === parseValue(value)) || value,
        valid: validate(parseValue(value)),
      });
    }
  }, [value, options]);

  useEffect(() => {
    if (state.selectedIndex >= 0) {
      dropdownRef.current?.innerRef.current?.querySelector(
        `.dropdown-item:nth-child(${state.selectedIndex + 1})`
      )?.focus();
    }
  }, [state.selectedIndex]);

  useTimeout(() => {
    search_();
  }, searchThreshold, [state.searchValue]);

  const onToggle_ = ({ opened }) => {
    dispatch({
      opened,
      searchValue: '',
      searchResults: null,
      searching: false,
      selectedIndex: null,
    });
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

  const onSelectionChange_ = e => {
    if (e.key === 'ArrowUp' && state.opened) {
      dispatch({
        selectedIndex: (state.selectedIndex
          ? state.selectedIndex
          : options.length
        ) - 1,
      });
    } else if (e.key === 'ArrowDown' && state.opened) {
      dispatch({
        selectedIndex: parseInt(state.selectedIndex, 10) < options.length - 1
          ? state.selectedIndex + 1
          : 0,
      });
    }
  };

  const onChange_ = (option, e) => {
    e.preventDefault();

    if (disabled) {
      return;
    }

    state.value = option;
    state.valid = validate(parseValue(option));

    dispatch({ value: state.value, dirty: true, valid: state.valid });

    dropdownRef.current?.close();
    fieldRef.current?.setDirty(true);

    onChange({ value: parseValue(state.value), valid: state.valid });
  };

  const onSearch_ = field =>
    dispatch({ searchValue: field.value, searching: true });

  const search_ = async () => {
    if (!state.searchValue) {
      dispatch({ searching: false, searchResults: null });
    }

    if (state.searchValue?.length < searchMinCharacters) {
      return;
    }

    const results = await search(state.searchValue);
    dispatch({ searchResults: results, searching: false });
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
      searchValue: '',
      searchResults: null,
      searching: false,
    });

    fieldRef.current?.reset();
    searchFieldRef.current?.reset();
  };

  const renderOption = (o, index) => (
    <DropdownItem
      key={index}
      tabIndex={0}
      onKeyPress={onSelect_.bind(null, o)}
    >
      <a href="#" onClick={onChange_.bind(null, o)} tabIndex={-1}>
        { parseTitle(o) }
      </a>
    </DropdownItem>
  );

  return (
    <div
      ref={innerRef}
      className={classNames(
        'junipero',
        'field',
        'select',
        { searching: state.searching },
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
          { search && (
            <div className="search">
              <TextField
                ref={searchFieldRef}
                disabled={disabled}
                placeholder={searchPlaceholder}
                label={searchLabel}
                value={state.searchValue}
                onChange={onSearch_}
              />
            </div>
          )}
          { state.searchResults ? (
            <div className="search-results">
              { state.searchResults.length
                ? state.searchResults?.map((o, index) => renderOption(o, index))
                : (
                  <div className="no-results">{ noSearchResults }</div>
                ) }
            </div>
          ) : (
            <div className="items">
              { options.length
                ? options.map((o, index) => renderOption(o, index))
                : (
                  <div className="no-items">{ noItems }</div>
                ) }
            </div>
          ) }
        </DropdownMenu>
      </Dropdown>
    </div>
  );
});

SelectField.propTypes = {
  search: PropTypes.func,
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
  noItems: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  noSearchResults: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
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
  searchPlaceholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  searchLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
    PropTypes.bool,
  ]),
  searchMinCharacters: PropTypes.number,
  searchThreshold: PropTypes.number,
  validate: PropTypes.func,
  value: PropTypes.any,
};

export default SelectField;
