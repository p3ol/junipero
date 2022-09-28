import {
  forwardRef,
  useReducer,
  useEffect,
  useRef,
  useLayoutEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import {
  classNames,
  mockState,
  exists,
  filterDeep,
  findDeep,
} from '@junipero/core';
import { useTimeout } from '@junipero/hooks';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';
import { Arrows, Remove } from '../icons';
import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownGroup from '../DropdownGroup';
import DropdownItem from '../DropdownItem';
import Tag from '../Tag';

const SelectField = forwardRef(({
  className,
  options,
  placeholder,
  value,
  valid,
  autoFocus = false,
  clearable = true,
  disabled = false,
  multiple = false,
  noOptionsLabel = 'No options',
  searchMinCharacters = 2,
  searchThreshold = 400,
  required = false,
  onChange,
  parseItem = val => val,
  parseTitle = val => val?.toString?.(),
  parseValue = val => val,
  onBlur,
  onFocus,
  onValidate = (val, { required, multiple }) => (
    (multiple && Array.isArray(val) && val.length > 0) ||
    (!multiple && !!val) ||
    !required
  ),
  onSearch,
  ...rest
}, ref) => {
  const dropdownRef = useRef();
  const searchInputRef = useRef();
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState, {
    value,
    valid: valid ?? false,
    dirty: false,
    opened: !multiple ? autoFocus ?? false : false,
    focused: autoFocus ?? false,
    search: '',
    searching: false,
    searchResults: null,
  });

  useImperativeHandle(ref, () => ({
    innerRef: dropdownRef,
    searchInputRef,
    value: state.value,
    valid: state.valid,
    dirty: state.dirty,
    focused: state.focused,
    opened: state.opened,
    reset,
    isJunipero: true,
  }));

  useEffect(() => {
    if (exists(value)) {
      dispatch({
        value: findOptions(options, value) || value,
        valid: onValidate(parseValue(value), { required, multiple }),
      });
    }
  }, [value, options]);

  useLayoutEffect(() => {
    if (!searchInputRef.current) {
      return;
    }

    searchInputRef.current.size = searchInputRef.current.placeholder.length;
  }, [placeholder]);

  useTimeout(() => {
    if (state.search.length >= searchMinCharacters) {
      onSearchResults();
    } else if (state.searchResults) {
      onClearSearchResults();
    }
  }, searchThreshold, [state.search]);

  const onChange_ = ({ close = true, resetSearch = false } = {}) => {
    dispatch({
      value: state.value,
      valid: state.valid,
      dirty: true,
      ...resetSearch && { search: '', searchResults: null },
    });
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

    state.valid = onValidate(parseValue(state.value), { required, multiple });
    onChange_({ resetSearch: !multiple });
  };

  const onRemoveOption = option => {
    if (disabled || !multiple || !Array.isArray(state.value)) {
      return;
    }

    state.value = state.value.filter(val => val !== option);
    state.valid = onValidate(parseValue(state.value), { required, multiple });
    onChange_({ close: false });
  };

  const onClear = e => {
    e.stopPropagation();

    if (!clearable) {
      return;
    }

    if (multiple) {
      state.value = [];
    } else {
      state.value = value;
    }

    state.valid = onValidate(parseValue(state.value), { required, multiple });
    onChange_({ close: false, resetSearch: true });
  };

  const onSearchInputChange = e => {
    dispatch({ search: e.target.value });
  };

  const onSearchResults = async () => {
    let results;

    if (onSearch) {
      dispatch({ searching: true });
      results = await onSearch(state.search);
    } else {
      results = filterOptions(state.search);
    }

    dispatch({ searchResults: results, searching: false });
  };

  const onClearSearchResults = () => {
    dispatch({ searchResults: null });
  };

  const onFocusField = e => {
    e.preventDefault();
    searchInputRef.current?.focus();
  };

  const onFocus_ = e => {
    dispatch({ focused: true });
    onFocus?.(e);
  };

  const onBlur_ = e => {
    dispatch({ focused: false });
    onBlur?.(e);
  };

  const onToggle_ = ({ opened }) => {
    state.opened = opened;
    dispatch({ opened });

    updateControl?.({ focused: opened });
  };

  const reset = () => {
    dispatch({
      value: value ?? '',
      valid: valid ?? false,
      dirty: false,
      search: '',
      searchResults: null,
    });
    updateControl?.({ dirty: false, valid: valid ?? false });
  };

  const filterOptions = val => {
    if (!val) {
      return options;
    }

    const search = new RegExp(val, 'i');

    return filterDeep(options, v =>
      search.test(parseTitle(v)) || search.test(parseValue(v))
    );
  };

  const findOptions = val => {
    const isMultiple = multiple && Array.isArray(val);
    const res = (isMultiple ? val : [val])
      .map(v => findDeep(options, o => parseItem(o) === parseItem(v)) || v);

    return isMultiple ? res : res[0];
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

  const isEmpty = () =>
    !hasValue() && !hasTags();

  const renderedOptions = useMemo(() => (
    filterUsedOptions(
      state.searchResults ? state.searchResults : options
    ).map((o, i) => (
      o?.options ? renderGroup(o, i) : renderOption(o, i)
    ))
  ), [state.searchResults, state.value, options]);

  return (
    <Dropdown
      { ...rest }
      ref={dropdownRef}
      clickOptions={{ toggle: false, keyboardHandlers: false }}
      className={classNames(
        'select-field',
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        {
          searching: state.searching,
          empty: isEmpty(),
          focused: state.focused,
        },
        className
      )}
      onToggle={onToggle_}
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
              onChange={onSearchInputChange}
              ref={searchInputRef}
              autoFocus={autoFocus}
              onFocus={onFocus_}
              onBlur={onBlur_}
            />
          ) }
          <div className="icons">
            { !!state.value && clearable && <Remove onClick={onClear} /> }
            <Arrows />
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu
        className={classNames('select-menu', { searching: state.searching })}
      >
        <div className="content">
          { renderedOptions.length > 0 && renderedOptions.some(o => o !== null)
            ? renderedOptions
            : (
              <div className="no-options">{ noOptionsLabel }</div>
            ) }
        </div>
      </DropdownMenu>
    </Dropdown>
  );
});

SelectField.displayName = 'SelectField';
SelectField.propTypes = {
  autoFocus: PropTypes.bool,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  noOptionsLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  options: PropTypes.array,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  searchMinCharacters: PropTypes.number,
  searchThreshold: PropTypes.number,
  valid: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onValidate: PropTypes.func,
  parseItem: PropTypes.func,
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
};

export default SelectField;
