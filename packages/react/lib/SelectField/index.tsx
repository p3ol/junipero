import {
  type RefObject,
  type ReactNode,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ChangeEvent,
  useReducer,
  useEffect,
  useRef,
  useLayoutEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import {
  classNames,
  exists,
  filterDeep,
  findDeep,
  mockState,
} from '@junipero/core';
import { useTimeout } from '@junipero/hooks';

import type {
  FieldContent,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import type { TransitionProps } from '../Transition';
import { useFieldControl } from '../hooks';
import { Arrows, Remove } from '../icons';
import Dropdown, { type DropdownRef } from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownGroup from '../DropdownGroup';
import DropdownItem from '../DropdownItem';
import Tag from '../Tag';
import Spinner from '../Spinner';
import AccessibilityStore from '../AccessibilityStore';

export declare type SelectFieldValue =
  | string | number | boolean | object | null;

export declare interface SelectFieldOptionObject {
  title?: string;
  value?: SelectFieldValue;
}

export declare interface SelectFieldGroupObject {
  title?: string;
  options?: (SelectFieldOptionObject | SelectFieldValue)[];
}

export declare interface SelectFieldRef extends JuniperoRef {
  dirty: boolean;
  focused: boolean;
  opened: boolean;
  value: SelectFieldValue | SelectFieldOptionObject;
  valid: boolean;
  blur(): void;
  focus(): void;
  reset(): void;
  innerRef: RefObject<DropdownRef>;
  searchInputRef: RefObject<HTMLInputElement>;
}

export declare interface SelectFieldProps extends Omit<
  SpecialComponentPropsWithRef<typeof Dropdown, SelectFieldRef>,
  'onChange'
> {
  allowArbitraryItems?: boolean;
  autoFocus?: boolean;
  className?: string;
  clearable?: boolean;
  disabled?: boolean;
  keyboardHandler?: boolean;
  multiple?: boolean;
  noOptionsEnabled?: boolean;
  noOptionsLabel?: ReactNode;
  options?: (SelectFieldOptionObject | SelectFieldValue)[];
  placeholder?: string;
  name?: string;
  required?: boolean;
  searchable?: boolean;
  searchMinCharacters?: number;
  searchThreshold?: number;
  toggleClick?: boolean;
  valid?: boolean;
  value?: SelectFieldValue | SelectFieldOptionObject
    | (SelectFieldValue | SelectFieldOptionObject)[];
  hasMore?: boolean;
  loadingMoreLabel?: ReactNode;
  noMoreOptionsEnabled?: boolean;
  noMoreOptionsLabel?: ReactNode;
  animateMenu?(
    menu: ReactNode,
    opts: {
      opened: boolean;
    } & Partial<TransitionProps>
  ): ReactNode;
  onChange?(field: FieldContent<SelectFieldValue>): void;
  onBlur?(event: FocusEvent<HTMLInputElement>): void;
  onFocus?(event: FocusEvent<HTMLInputElement>): void;
  onKeyPress?(event: KeyboardEvent): void;
  onKeyUp?(event: KeyboardEvent): void;
  onValidate?(
    value: SelectFieldValue,
    flags: { required: boolean; multiple: boolean }
  ): boolean;
  onSearch?(search: string):
    Promise<(SelectFieldValue | SelectFieldOptionObject)[]>;
  onLoadMore?(page: number): Promise<void>;
  parseTitle?(
    option: SelectFieldValue | SelectFieldOptionObject | SelectFieldGroupObject,
    flags?: {
      isTag?: boolean;
      isValue?: boolean;
      isOption?: boolean;
      isGroup?: boolean;
    },
  ): string;
  parseValue?(
    option: SelectFieldValue | SelectFieldOptionObject | SelectFieldGroupObject,
  ): SelectFieldValue | SelectFieldOptionObject;
}

export declare interface SelectFieldState {
  value: SelectFieldValue | SelectFieldOptionObject |
    (SelectFieldValue | SelectFieldOptionObject)[];
  valid: boolean;
  dirty: boolean;
  opened: boolean;
  focused: boolean;
  search: string;
  searching: boolean;
  searchResults: (SelectFieldValue | SelectFieldOptionObject)[];
  selectedItem: number;
  placeholderSize: number;
  page: number;
  loading: boolean;
  refocus?: boolean;
}

const SelectField = ({
  ref,
  toggleClick,
  className,
  options,
  placeholder,
  value,
  valid,
  name,
  keyboardHandler = false,
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
  hasMore = true,
  loadingMoreLabel = 'Loading more options...',
  noMoreOptionsEnabled = true,
  noMoreOptionsLabel = '🎉 No more options',
  animateMenu,
  onChange,
  onBlur,
  onFocus,
  onKeyPress,
  onKeyUp,
  onSearch,
  onLoadMore,
  parseTitle = val => val?.toString?.(),
  parseValue = val => val,
  onValidate = (val, { required, multiple }) => (
    (multiple && Array.isArray(val) && val.length > 0) ||
    (!multiple && exists(val) && val !== '') ||
    !required
  ),
  ...rest
}: SelectFieldProps) => {
  const dropdownRef = useRef<DropdownRef>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState<SelectFieldState>, {
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
    page: 1,
    loading: false,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options]);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (onLoadMore && loadMoreRef.current) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !state.loading) {
          dispatch({ page: state.page + 1 });
          loadMore(state.page + 1);
        }
      });

      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoadMore, state.opened]);

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

    if (close) {
      dropdownRef.current?.close?.();
    }
  };

  const onSelectOption = (
    option: SelectFieldValue | SelectFieldOptionObject,
    changeOpts: Record<string, boolean> = {}
  ) => {
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

  const onRemoveOption = (
    option: SelectFieldValue | SelectFieldOptionObject
  ) => {
    if (disabled || !multiple || !Array.isArray(state.value)) {
      return;
    }

    state.value = state.value.filter(val => val !== option);
    state.valid = onValidate(parseValue(state.value), { required, multiple });
    onChange_({ close: false });
  };

  const onAccessibilitySelectOption = (focusedId: number) => {
    onSelectOption(
      filterUsedOptions(state.searchResults
        ? state.searchResults
        : options
      )[focusedId]
    );
  };

  const onClear = (e: MouseEvent) => {
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

  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const onFocusField = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  };

  const onFocus_ = (e: FocusEvent<HTMLInputElement>) => {
    dispatch({ focused: true });
    onFocus?.(e);
  };

  const onBlur_ = (e: FocusEvent<HTMLInputElement>) => {
    if (allowArbitraryItems && state.search) {
      onSelectOption(state.search, { resetSearch: true });
    }

    dispatch({ focused: false, opened: false });
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

  const onKeyPress_ = (e: KeyboardEvent) => {
    if (disabled) {
      return;
    }

    switch (e.key) {
      case 'Enter':
        e.preventDefault();

        if (allowArbitraryItems) {
          onSelectOption(state.search, { resetSearch: true });
        }

        break;
    }

    onKeyPress?.(e);
  };

  const onKeyUp_ = (e: KeyboardEvent) => {
    if (disabled || !Array.isArray(state.value)) {
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

  const loadMore = async (page: number) => {
    if (state.loading || !hasMore) {
      return;
    }

    dispatch({ loading: true });

    try {
      await onLoadMore?.(page);
    } catch (e) {
      console.error(e);
    }

    dispatch({ loading: false });
  };

  const filterOptions = (
    val?: string
  ): (SelectFieldValue | SelectFieldOptionObject)[] => {
    if (!val) {
      return options;
    }

    const search = new RegExp(val, 'i');

    return filterDeep(options, v =>
      search.test(parseTitle(v)) || search.test(parseValue(v)?.toString())
    );
  };

  const findOptions = (
    val:
      | SelectFieldValue | SelectFieldValue[]
      | SelectFieldOptionObject | SelectFieldOptionObject[],
  ): SelectFieldValue | SelectFieldOptionObject |
    (SelectFieldValue | SelectFieldOptionObject)[] => {
    const isMultiple = multiple && Array.isArray(val);
    const res = (isMultiple ? val : [val]).map(v =>
      findDeep(options, o => parseValue(o) === parseValue(v), o => o.options) ||
      v
    );

    return isMultiple ? res : res[0];
  };

  const filterUsedOptions = (
    opts: (SelectFieldValue | SelectFieldOptionObject)[] = []
  ) => {
    if (multiple && Array.isArray(state.value)) {
      return opts.filter(opt => (
        !(state.value as (SelectFieldValue | SelectFieldOptionObject)[])
          .includes(opt)
      ));
    } else {
      return opts;
    }
  };

  const renderGroup = (
    group: SelectFieldGroupObject,
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

  const renderOption = (
    item: SelectFieldValue | SelectFieldOptionObject,
    i: number
  ) => (
    <DropdownItem key={i} a11yKey={i}>
      <a onClick={() => onSelectOption(item)}>
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
      (o as SelectFieldGroupObject)?.options
        ? renderGroup(o as SelectFieldGroupObject, i) : renderOption(o, i)
    ))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [
    state.searchResults,
    state.value,
    options,
    onChange,
    parseTitle,
    disabled,
    multiple,
  ]);

  const hasOptions = useMemo(() => (
    renderedOptions.length > 0 && renderedOptions.some(o => o !== null)
  ), [renderedOptions]);

  return (
    <AccessibilityStore handleAction={onAccessibilitySelectOption}>
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
        withAccessibility={false}
      >
        <DropdownToggle>
          <div
            className="field"
            onClick={onFocusField}
            onFocus={() => {
              dropdownRef.current?.open?.();
              dispatch({ opened: true, focused: false });
            }}
          >
            { hasValue() && (
              <input
                type="text"
                name={name}
                readOnly={true}
                value={parseTitle(state.value, { isValue: true }) ?? ''}
                onChange={() => {}}
              />
            ) }
            { hasTags() && Array.isArray(state.value)
              ? state.value.map((o: any, i: number) => (
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
                name={name}
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
              { (!allowArbitraryItems || options?.length > 0) && (
                <Arrows />
              )}
            </div>
          </div>
        </DropdownToggle>
        { (hasOptions || state.searchResults?.length > 0 || noOptionsEnabled) &&
          (
            <DropdownMenu
              a11yFocus={false}
              animate={animateMenu}
              className={classNames('select-menu', {
                searching: state.searching,
                loading: state.loading,
              })}
            >
              <div className="content">
                { hasOptions ? (
                  <>
                    { renderedOptions }
                    { onLoadMore && (
                      <div ref={loadMoreRef} className="load-more">
                        { state.loading ? (
                          <DropdownItem className="loader">
                            <Spinner className="primary small" />
                            { loadingMoreLabel}
                          </DropdownItem>
                        ) : !hasMore && noMoreOptionsEnabled && (
                          <DropdownItem className="no-more-options">
                            { noMoreOptionsLabel }
                          </DropdownItem>
                        ) }
                      </div>
                    ) }
                  </>
                ) : (
                  <div className="no-options">{ noOptionsLabel }</div>
                ) }
              </div>
            </DropdownMenu>
          ) }
      </Dropdown>
    </AccessibilityStore>
  );
};

SelectField.displayName = 'SelectField';

export default SelectField;
