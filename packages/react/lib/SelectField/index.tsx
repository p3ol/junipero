import {
  forwardRef,
  useReducer,
  useEffect,
  useRef,
  useLayoutEffect,
  useImperativeHandle,
  useMemo,
  MutableRefObject,
  ComponentPropsWithRef,
  ReactNode,
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
import { ForwardedProps, MockState } from '../utils';

export declare type SelectFieldRef = {
  dirty: boolean;
  focused: boolean;
  isJunipero: boolean;
  opened: boolean;
  value: any;
  valid: boolean;
  blur(): void;
  focus(): void;
  reset(): void;
  innerRef: MutableRefObject<any>;
  searchInputRef: MutableRefObject<any>;
};

export declare interface SelectFieldProps extends ComponentPropsWithRef<any> {
  allowArbitraryItems?: boolean;
  autoFocus?: boolean;
  className?: string;
  clearable?: boolean;
  disabled?: boolean;
  keyboardHandler?: boolean;
  multiple?: boolean;
  noOptionsEnabled?: boolean;
  noOptionsLabel?: ReactNode | JSX.Element;
  options?: Array<any>;
  placeholder?: string;
  required?: boolean;
  searchable?: boolean;
  searchMinCharacters?: number;
  searchThreshold?: number;
  toggleClick?: boolean;
  valid?: boolean;
  value?: any;
  animateMenu?(
    menu: ReactNode | JSX.Element,
    opts: { opened: boolean }
  ): ReactNode | JSX.Element;
  onChange?(props: { value: any; valid: boolean }): void;
  onBlur?(event: React.SyntheticEvent): void;
  onFocus?(event: React.FocusEvent): void;
  onKeyPress?(event: React.KeyboardEvent): void;
  onKeyUp?(event: React.KeyboardEvent): void;
  onValidate?(
    value: any,
    flags: { required: boolean; multiple: boolean }
  ): boolean;
  onSearch?(search: string): Promise<Array<any>>;
  parseTitle?(option: any, flags?: {
    isTag?: boolean;
    isValue?: boolean;
    isOption?: boolean;
    isGroup?: boolean;
  }): string;
  parseValue?(option: any): any;
  ref?: MutableRefObject<SelectFieldRef | undefined>;
}

const SelectField = forwardRef(({
  toggleClick,
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
}: SelectFieldProps, ref) => {
  const dropdownRef = useRef<any>();
  const searchInputRef = useRef<any>();
  const { update: updateControl } = useFieldControl();

  type SelectFieldState = {
    value: any;
    valid: boolean;
    dirty: boolean;
    opened: boolean;
    focused: boolean;
    search: string;
    searching: boolean;
    searchResults: Array<any>;
    selectedItem: number;
    placeholderSize: number;
    refocus?: boolean;
  }

  const [state, dispatch] = useReducer<MockState<SelectFieldState>>(mockState, {
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
      state.value = findOptions(value) || value;
    } else {
      state.value = multiple ? [] : null;
    }

    dispatch({
      value: state.value,
      valid: onValidate(parseValue(state.value), { required, multiple }),
    });
  }, [value, options]);

  useLayoutEffect(() => {
    dispatch({ placeholderSize: Math.max(10, placeholder?.length ?? 0) });
  }, [placeholder]);

  useTimeout(() => {
    if ((multiple || !state.value) && state.dirty && searchable) {
      searchInputRef.current?.focus?.();
      dispatch({ refocus: false });
    }
  }, 1, [
    state.refocus,
    state.value,
    state.dirty,
    searchable,
    multiple,
  ], { enabled: state.refocus });

  useTimeout(() => {
    if (state.search.length >= searchMinCharacters) {
      onSearchResults();
    } else if (state.searchResults) {
      onClearSearchResults();
    }
  }, searchThreshold, [state.search]);

  const onChange_ = (
    { close = true, resetSearch, refocus }:
    { close?: boolean, resetSearch?: boolean, refocus?: boolean } = {}
  ) => {
    if (disabled) {
      return;
    }

    dispatch({
      value: state.value,
      valid: state.valid,
      dirty: true,
      selectedItem: -1,
      ...resetSearch && { search: '', searchResults: null },
      ...refocus && { refocus: true },
    });
    onChange?.({ value: parseValue(state.value), valid: state.valid });
    updateControl?.({ valid: state.valid, dirty: true });
    close && dropdownRef.current?.close?.();
  };

  const onSelectOption = (option: any, changeOpts = {}) => {
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

  const onRemoveOption = (option: any) => {
    if (disabled || !multiple || !Array.isArray(state.value)) {
      return;
    }

    state.value = state.value.filter(val => val !== option);
    state.valid = onValidate(parseValue(state.value), { required, multiple });
    onChange_({ close: false });
  };

  const onClear = (e: React.MouseEvent) => {
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

    onChange_({ close: false, resetSearch: true, refocus: true });
  };

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    dropdownRef.current?.open();
    dispatch({ searchResults: results, searching: false });
  };

  const onClearSearchResults = () => {
    dispatch({ searchResults: null });
  };

  const onFocusField = (e: React.MouseEvent) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  };

  const onFocus_ = (e: React.FocusEvent) => {
    dispatch({ focused: true });
    onFocus?.(e);
  };

  const onBlur_ = (e: React.SyntheticEvent) => {
    dispatch({ focused: false });
    onBlur?.(e);
  };

  const onToggle_ = ({ opened }: { opened: boolean}) => {
    if (disabled) {
      return;
    }

    state.opened = opened;
    dispatch({ opened });

    updateControl?.({ focused: opened });
  };

  const onKeyPress_ = (e: React.KeyboardEvent) => {
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

  const onKeyUp_ = (e: React.KeyboardEvent) => {
    if (disabled) {
      return;
    }

    switch (e.key) {
      case 'Backspace':
        if (state.search) {
          return;
        }

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

  const filterOptions = (val?: string) => {
    if (!val) {
      return options;
    }

    const search = new RegExp(val, 'i');

    return filterDeep(options, v =>
      search.test(parseTitle(v)) || search.test(parseValue(v))
    );
  };

  const findOptions = (val: Array<string> | string): string | Array<string> => {
    const isMultiple = multiple && Array.isArray(val);
    const res = (isMultiple ? val : [val]).map(v =>
      findDeep(options, o => parseValue(o) === parseValue(v), o => o.options) ||
      v
    );

    return isMultiple ? res : res[0];
  };

  const filterUsedOptions = (opts: Array<any> = []) =>
    multiple && Array.isArray(state.value)
      ? opts.filter(opt => !state.value.includes(opt))
      : opts;

  const renderGroup = (
    group: { options: Array<any>, [_: string]: any },
    i: number
  ) => {
    const opts = filterUsedOptions(group.options);

    if (!opts.length) {
      return null;
    }

    return (
      <DropdownGroup key={i} title={parseTitle(group, { isGroup: true })}>
        { opts.map((o, n) => renderOption(o, n)) }
      </DropdownGroup>
    );
  };

  const renderOption = (item: any, i: number) => (
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
      clickOptions={{
        toggle: toggleClick ?? !searchable,
        keyboardHandlers: keyboardHandler,
      }}
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
              value={parseTitle(state.value, { isValue: true }) ?? ''}
              onChange={() => {}}
            />
          ) }
          { hasTags() ? state.value.map((o: any, i: number) => (
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
}) as ForwardedProps<SelectFieldProps, SelectFieldRef>;

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
