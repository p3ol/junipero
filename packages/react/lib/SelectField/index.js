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
import Spinner from '../Spinner';

const SelectField = forwardRef(({
  toggleClick = false,
  keyboardHandler = false,
  animateMenu,
  className,
  options,
  placeholder,
  value,
  valid,
  allowArbitraryItems = false,
  autoFocus = false,
  clearable = true,
  disabled = false,
  multiple = false,
  noOptionsEnabled = true,
  noOptionsLabel = 'No options',
  searchable = true,
  searchMinCharacters = 2,
  searchThreshold = 400,
  required = false,
  onChange,
  parseTitle = val => val?.toString?.(),
  parseValue = val => val,
  onBlur,
  onFocus,
  onKeyPress,
  onKeyUp,
  onValidate = (val, { required, multiple }) => (
    (multiple && Array.isArray(val) && val.length > 0) ||
    (!multiple && exists(val) && val !== '') ||
    !required
  ),
  onSearch,
  ...rest
}, ref) => {
  const dropdownRef = useRef();
  const searchInputRef = useRef();
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState, {
    value: value ?? (multiple ? [] : null),
    valid: valid ?? false,
    dirty: false,
    opened: !multiple ? autoFocus ?? false : false,
    focused: autoFocus ?? false,
    search: '',
    searching: false,
    searchResults: null,
    selectedItem: -1,
    placeholderSize: Math.max(10, placeholder?.length ?? 0),
  });

  useImperativeHandle(ref, () => ({
    innerRef: dropdownRef,
    searchInputRef,
    value: state.value,
    valid: state.valid,
    dirty: state.dirty,
    focused: state.focused,
    opened: state.opened,
    focus,
    blur,
    reset,
    isJunipero: true,
  }));

  useEffect(() => {
    if (exists(value)) {
      state.value = findOptions(value) || (value ?? (multiple ? [] : null));
      dispatch({
        value: state.value,
        valid: onValidate(parseValue(state.value), { required, multiple }),
      });
    }
  }, [value, options]);

  useLayoutEffect(() => {
    dispatch({ placeholderSize: Math.max(10, placeholder?.length ?? 0) });
  }, [placeholder]);

  useEffect(() => {
    if ((multiple || !state.value) && state.dirty && searchable) {
      searchInputRef.current?.focus?.();
    }
  }, [state.value]);

  useTimeout(() => {
    if (state.search.length >= searchMinCharacters) {
      onSearchResults();
    } else if (state.searchResults) {
      onClearSearchResults();
    }
  }, searchThreshold, [state.search]);

  const onChange_ = ({ close = true, resetSearch = false } = {}) => {
    if (disabled) {
      return;
    }

    dispatch({
      value: state.value,
      valid: state.valid,
      dirty: true,
      selectedItem: -1,
      ...resetSearch && { search: '', searchResults: null },
    });
    onChange?.({ value: parseValue(state.value), valid: state.valid });
    updateControl?.({ valid: state.valid, dirty: true });
    close && dropdownRef.current?.close?.();
  };

  const onSelectOption = (option, changeOpts = {}) => {
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
    onChange_({ resetSearch: !multiple, ...changeOpts });
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

    if (!clearable || disabled) {
      return;
    }

    if (multiple) {
      state.value = [];
    } else {
      state.value = undefined;
    }

    state.valid = onValidate(parseValue(state.value), { required, multiple });

    onChange_({ close: false, resetSearch: true });
  };

  const onSearchInputChange = e => {
    if (!searchable || disabled) {
      return;
    }

    dispatch({ search: e.target.value });
  };

  const onSearchResults = async () => {
    let results;

    if (onSearch) {
      dispatch({ searching: true });
      results = await onSearch(state.search);
    } else if (searchable) {
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
    if (disabled) {
      return;
    }

    state.opened = opened;
    dispatch({ opened });

    updateControl?.({ focused: opened });
  };

  const onKeyPress_ = e => {
    if (disabled) {
      return;
    }

    switch (e.key) {
      case 'Enter':
        if (allowArbitraryItems) {
          onSelectOption(state.search, { resetSearch: true });
        }

        break;
    }

    onKeyPress?.(e);
  };

  const onKeyUp_ = e => {
    if (disabled) {
      return;
    }

    switch (e.key) {
      case 'Backspace':
        if (state.selectedItem >= 0) {
          onRemoveOption(state.value[state.selectedItem]);
        } else {
          dispatch({ selectedItem: (state.value?.length ?? 0) - 1 });
        }

        break;

      case 'ArrowLeft':
        if (state.selectedItem > 0) {
          dispatch({ selectedItem: state.selectedItem - 1 });
        } else if (state.selectedItem === -1 && !state.search) {
          dispatch({ selectedItem: (state.value?.length ?? 0) - 1 });
        }

        break;

      case 'ArrowRight':
        if (state.selectedItem < (state.value?.length ?? 0) - 1) {
          dispatch({ selectedItem: state.selectedItem + 1 });
        } else if (state.selectedItem !== -1) {
          dispatch({ selectedItem: -1 });
        }

        break;
    }

    onKeyUp?.(e);
  };

  const focus = () => {
    if (multiple) {
      searchInputRef.current?.focus();
    } else {
      dispatch({ focused: false });
      dropdownRef.current?.open();
    }
  };

  const blur = () => {
    if (multiple) {
      searchInputRef.current?.blur();
    } else {
      dispatch({ focused: false });
      dropdownRef.current?.close();
    }
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
    const res = (isMultiple ? val : [val]).map(v =>
      findDeep(options, o => parseValue(o) === parseValue(v), o => o.options) ||
      v
    );

    return isMultiple ? res : res[0];
  };

  const filterUsedOptions = (opts = []) =>
    multiple && Array.isArray(state.value)
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
      <a onClick={onSelectOption.bind(null, item)}>
        { parseTitle(item, { isOption: true }) }
      </a>
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
  ), [state.searchResults, state.value, options, onChange]);

  const hasOptions = useMemo(() => (
    renderedOptions.length > 0 && renderedOptions.some(o => o !== null)
  ), [renderedOptions]);

  return (
    <Dropdown
      { ...rest }
      opened={state.opened}
      ref={dropdownRef}
      disabled={disabled}
      clickOptions={{ toggle: toggleClick, keyboardHandlers: keyboardHandler }}
      className={classNames(
        'select-field',
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        {
          searchable,
          searching: state.searching,
          empty: isEmpty(),
          focused: state.focused,
          multiple,
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
              value={parseTitle(state.value, { isValue: true })}
            />
          ) }
          { hasTags() ? state.value.map((o, i) => (
            <Tag
              key={i}
              className={classNames(
                'info',
                { selected: i === state.selectedItem }
              )}
              onDelete={onRemoveOption.bind(null, o)}
            >
              { parseTitle(o, { isTag: true }) }
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
              disabled={disabled || !searchable}
              onFocus={onFocus_}
              onBlur={onBlur_}
              onKeyPress={onKeyPress_}
              onKeyUp={onKeyUp_}
              size={state.placeholderSize}
            />
          ) }
          <div className="icons">
            { state.searching && <Spinner className="small" /> }
            { !!state.value && clearable && (!isEmpty() || state.search) && (
              <Remove onClick={onClear} />
            ) }
            <Arrows />
          </div>
        </div>
      </DropdownToggle>
      { (hasOptions || noOptionsEnabled || state.searchResults) && (
        <DropdownMenu
          animate={animateMenu}
          className={classNames('select-menu', { searching: state.searching })}
        >
          <div className="content">
            { hasOptions ? renderedOptions : (
              <div className="no-options">{ noOptionsLabel }</div>
            ) }
          </div>
        </DropdownMenu>
      ) }
    </Dropdown>
  );
});

SelectField.displayName = 'SelectField';
SelectField.propTypes = {
  animateMenu: PropTypes.func,
  allowArbitraryItems: PropTypes.bool,
  autoFocus: PropTypes.bool,
  clearable: PropTypes.bool,
  toggleClick: PropTypes.bool,
  disabled: PropTypes.bool,
  keyboardHandler: PropTypes.bool,
  multiple: PropTypes.bool,
  noOptionsEnabled: PropTypes.bool,
  noOptionsLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  options: PropTypes.array,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  searchable: PropTypes.bool,
  searchMinCharacters: PropTypes.number,
  searchThreshold: PropTypes.number,
  valid: PropTypes.bool,
  value: PropTypes.any,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  onSearch: PropTypes.func,
  onValidate: PropTypes.func,
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
};

export default SelectField;
