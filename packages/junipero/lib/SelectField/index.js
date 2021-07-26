import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, exists, mockState } from '@poool/junipero-utils';
import { useTimeout, useEventListener } from '@poool/junipero-hooks';

import BaseField from '../BaseField';
import TextField from '../TextField';
import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownItem from '../DropdownItem';

const SelectField = forwardRef(({
  animateMenu,
  className,
  container,
  label,
  options,
  placeholder,
  search,
  searchLabel,
  value,
  dropdownProps,
  dropdownMenuProps,
  autoFocus = false,
  disabled = false,
  globalEventsTarget = global,
  noItems = 'No items found :(',
  noSearchResults = 'No result found :(',
  opened = false,
  required = false,
  searchAutoFocus = false,
  searchPlaceholder = 'Search...',
  searchMinCharacters = 2,
  searchThreshold = 400,
  trigger = 'click',
  onBlur = () => {},
  onChange = () => {},
  onFocus = () => {},
  onToggle = () => {},
  parseTitle = val => val?.toString?.(),
  parseValue = val => val,
  validate = val => !required || typeof val !== 'undefined',
  ...rest
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
    opened: opened ?? autoFocus,
    valid: false,
    dirty: false,
    selectedIndex: null,
    focused: autoFocus,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    dropdownRef,
    fieldRef,
    searchFieldRef,
    dirty: state.dirty,
    focused: state.focused,
    internalValue: state.value,
    valid: state.valid,
    opened: state.opened,
    searchValue: state.searchValue,
    searchResults: state.searchResults,
    searching: state.searching,
    focus,
    blur,
    reset,
    isJunipero: true,
  }));

  useEventListener('keydown', e => {
    if (state.opened) {
      onSelectionChange_(e);
    }
  }, globalEventsTarget);

  useEffect(() => {
    if (disabled) {
      dropdownRef.current?.close();
    } else if (autoFocus) {
      dropdownRef.current?.open();
    }
  }, [disabled]);

  useEffect(() => {
    if (exists(value)) {
      dispatch({
        value: options?.find(o => parseValue(o) === parseValue(value)) || value,
        valid: validate(parseValue(value)),
      });
    }
  }, [value, options]);

  useEffect(() => {
    /* istanbul ignore else: useless else */
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
    dispatch({ focused: true });
    onFocus(e);
  };

  const onMouseDown_ = () => {
    if (trigger === 'manual') {
      return;
    }

    if (state.opened && state.focused) {
      dropdownRef.current?.close();
    } else {
      dropdownRef.current?.open();
    }
  };

  const onBlur_ = e => {
    dispatch({ focused: false });
    onBlur(e);
  };

  const onSelect_ = (option, e) => {
    /* istanbul ignore else: useless else */
    if (e.key === 'Enter') {
      onChange_(option, e);
    }
  };

  const onSelectionChange_ = e => {
    /* istanbul ignore else: useless else */
    if (e.key === 'ArrowUp') {
      dispatch({
        selectedIndex: (state.selectedIndex
          ? state.selectedIndex
          : options?.length || 0
        ) - 1,
      });
    } else if (e.key === 'ArrowDown') {
      dispatch({
        selectedIndex: parseInt(state.selectedIndex, 10) <
          (options?.length || 0) - 1
          ? state.selectedIndex + 1
          : 0,
      });
    }
  };

  const onChange_ = (option, e) => {
    e.preventDefault();

    /* istanbul ignore next: not fired if menu is not opened anyway */
    if (disabled) {
      return;
    }

    state.value = option;
    state.valid = validate(parseValue(option));

    dispatch({ value: state.value, dirty: true, valid: state.valid });
    onChange({ value: parseValue(state.value), valid: state.valid });

    if (trigger !== 'manual') {
      dropdownRef.current?.close();
    }
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

    if (trigger !== 'manual') {
      dropdownRef.current?.open();
    }
  };

  const blur = () => {
    fieldRef.current?.blur();

    if (trigger !== 'manual') {
      dropdownRef.current?.close();
    }
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

    searchFieldRef.current?.reset();
  };

  const renderOption = (o, index) => o.options ? (
    <div key={index} className="items-group">
      <div className="group-label">{ parseTitle(o) }</div>
      <div className="items">
        { o.options.map(renderOption) }
      </div>
    </div>
  ) : (
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
      { ...rest }
      ref={innerRef}
      className={classNames(
        'junipero',
        'field',
        'select',
        {
          'with-search': !!search,
          searching: state.searching,
          focused: state.focused,
          dirty: state.dirty,
          disabled,
          invalid: !state.valid && state.dirty,
        },
        className,
      )}
    >
      <Dropdown
        disabled={disabled}
        {...dropdownProps}
        opened={state.opened}
        trigger={trigger}
        onToggle={onToggle_}
        ref={dropdownRef}
      >
        <DropdownToggle trigger="manual" href={null} tag="div">
          <BaseField
            ref={fieldRef}
            disabled={disabled}
            placeholder={placeholder}
            label={label}
            empty={!state.value}
            value={parseTitle(state.value || '')}
            valid={state.valid}
            focused={state.focused}
            onMouseDown={onMouseDown_}
            onFocus={onFocus_}
            onBlur={onBlur_}
            dirty={state.dirty}
            autoFocus={autoFocus}
          />
          <div className="arrow" />
        </DropdownToggle>
        <DropdownMenu
          animate={animateMenu}
          container={container}
          { ...dropdownMenuProps }
        >
          { search && (
            <div className="search">
              <TextField
                ref={searchFieldRef}
                autoFocus={searchAutoFocus}
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
              { options?.length
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
  container: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
  ]),
  disabled: PropTypes.bool,
  dropdownProps: PropTypes.object,
  dropdownMenuProps: PropTypes.object,
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
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
  opened: PropTypes.bool,
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  required: PropTypes.bool,
  searchAutoFocus: PropTypes.bool,
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
  trigger: PropTypes.string,
  validate: PropTypes.func,
  value: PropTypes.any,
};

export default SelectField;
