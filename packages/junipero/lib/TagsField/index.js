import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, mockState } from '@poool/junipero-utils';
import { useTimeout } from '@poool/junipero-hooks';

import Dropdown from '../Dropdown';
import DropdownMenu from '../DropdownMenu';
import DropdownToggle from '../DropdownToggle';
import DropdownItem from '../DropdownItem';

const TagsField = forwardRef(({
  autoFocus,
  className,
  label,
  options,
  placeholder,
  search,
  autoAddOnBlur = true,
  disabled = false,
  forceLabel = false,
  globalEventsTarget = global,
  noSearchResults = 'No result found :(',
  onlyAllowOptions = false,
  onlyAllowOneOccurence = true,
  required = false,
  searchMinCharacters = 2,
  searchThreshold = 400,
  value,
  onBlur = () => {},
  onChange = () => {},
  onFocus = () => {},
  onKeyDown = () => {},
  onKeyPress = () => {},
  onToggle = () => {},
  parseValue = val => val?.trim?.() || val,
  parseTitle = val => val,
  validate = val => !!val?.length || !required,
  validateInput = () => true,
  validateTag = val => !!val,
}, ref) => {
  const innerRef = useRef();
  const wrapperRef = useRef();
  const inputRef = useRef();
  const dropdownRef = useRef();
  const menuRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    value: [...(value || [])],
    valid: validate(value || []) && (value || []).every(t => validateTag(t)),
    availableOptions: options,
    inputValue: '',
    inputValid: true,
    inputDirty: false,
    dirty: false,
    focused: autoFocus ?? false,
    searchResults: null,
    searching: false,
    opened: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    wrapperRef,
    inputRef,
    dropdownRef,
    menuRef,
    internalValue: state.value,
    inputValue: state.inputValue,
    inputValid: state.inputValid,
    availableOptions: state.availableOptions,
    dirty: state.dirty,
    opened: state.opened,
    searchResults: state.searchResults,
    searching: state.searching,
    valid: state.valid,
    focused: state.focused,
    focus,
    blur,
    reset,
    add,
    remove,
  }));

  useEffect(() => {
    state.value = [...(value || [])];

    dispatch({
      value: state.value,
      valid: validate(state.value) && state.value.every(t => validateTag(t)),
    });
  }, [value]);

  useTimeout(() => {
    search_();
  }, searchThreshold, [state.inputValue]);

  const onInputChange_ = e => {
    if (disabled) {
      return;
    }

    dispatch({
      inputValue: e.target.value,
      inputDirty: true,
      inputValid: validateInput(e.target.value),
      searching: !!search,
    });

    if (!e.target.value.trim() && !!search && !options) {
      dropdownRef.current?.close();
    }
  };

  const onInputFocus_ = e => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    dispatch({ focused: true });

    if (state.searchResults || state.availableOptions?.length) {
      dropdownRef.current?.open();
    }

    onFocus(e);
  };

  const onInputBlur_ = e => {
    dispatch({ focused: false });

    const menu = dropdownRef.current?.menuRef.current;

    if (
      state.inputValue &&
      autoAddOnBlur &&
      !onlyAllowOptions &&
      validateInput(state.inputValue) &&
      (
        !menu ||
        !menu.contains(e.relatedTarget)
      )
    ) {
      add(state.inputValue);
    }

    onBlur(e);
  };

  const onKeyPress_ = e => {
    if (disabled) {
      return;
    }

    if (
      e.key === 'Enter' &&
      !onlyAllowOptions &&
      validateInput(state.inputValue)
    ) {
      add(state.inputValue);
    }

    onKeyPress(e);
  };

  const onKeyDown_ = e => {
    if (disabled) {
      return;
    }

    /* istanbul ignore else: useless else */
    if (
      (e.key === 'Backspace' || e.key === 'ArrowLeft') &&
      !state.inputValue.trim() &&
      state.value.length
    ) {
      focus(state.value.length - 1);
    } else if (e.key === 'Escape') {
      dropdownRef.current?.close();
    }

    onKeyDown(e);
  };

  const onTagKeyDown_ = (index, e) => {
    if (disabled) {
      return;
    }

    if (e.key === 'Backspace') {
      remove(index);
      inputRef.current?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focus(index - 1);
    } else if (e.key === 'ArrowRight') {
      focus(index + 1);
    } else if (e.key === 'Escape') {
      blur();
      focus();
    }
  };

  const onWrapperClick_ = e => {
    if (disabled || e.target !== wrapperRef.current) {
      return;
    } else {
      e.preventDefault();
    }

    focus();
  };

  const onDropdownToggle_ = ({ opened }) => {
    dispatch({ opened });
    onToggle({ opened });
  };

  const onOptionClick_ = (option, e) => {
    e.preventDefault();
    add(option);
  };

  const add = item => {
    if (disabled || (typeof item === 'string' && !item.trim())) {
      return;
    }

    if (
      !onlyAllowOneOccurence ||
      !state.value.find(i => parseValue(i) === parseValue(item))
    ) {
      state.value.push(item);
    }

    state.availableOptions = options?.filter(o =>
      !onlyAllowOneOccurence ||
      !state.value.find(i => parseValue(i) === parseValue(o)));

    dispatch({
      value: state.value,
      valid: validate(state.value) && state.value.every(t => validateTag(t)),
      availableOptions: state.availableOptions,
      inputValue: '',
      inputDirty: false,
      inputValid: true,
      dirty: true,
    });
    onChange({ value: state.value.map(i => parseValue(i)) });

    if (state.searchResults) {
      dispatch({ searchResults: null, searching: false });
    }

    dropdownRef.current?.close();
  };

  const remove = (index, e) => {
    e?.preventDefault?.();

    if (disabled) {
      return;
    }

    state.value.splice(index, 1);
    state.availableOptions = options?.filter(o =>
      !onlyAllowOneOccurence ||
      !state.value.find(i => parseValue(i) === parseValue(o)));

    dispatch({
      value: state.value,
      valid: validate(state.value) && state.value.every(t => validateTag(t)),
      availableOptions: state.availableOptions,
      dirty: true,
    });
    onChange({ value: state.value.map(i => parseValue(i)) });
  };

  const focus = index => {
    if (index >= 0 && index < state.value.length) {
      innerRef.current
        ?.querySelector(`.tag:nth-child(${index + 1})`)?.focus?.();
    } else {
      inputRef.current?.focus();
    }
  };

  const blur = () => {
    inputRef.current?.blur();
    innerRef.current?.querySelector('.tag:focus')?.blur();
  };

  const reset = () => {
    state.value = [...(value || [])];

    dispatch({
      value: state.value,
      dirty: false,
      valid: validate(state.value) && state.value.every(t => validateTag(t)),
      inputValue: '',
      inputDirty: false,
      inputValid: true,
    });
  };

  const search_ = async () => {
    if (!state.inputValue) {
      dispatch({ searching: false, searchResults: null });
    }

    if (!search || state.inputValue?.length < searchMinCharacters) {
      return;
    }

    const results = await search(state.inputValue);
    dispatch({
      searchResults: results.filter(r =>
        !onlyAllowOneOccurence ||
        !state.value.find(i => parseValue(i) === parseValue(r))
      ),
      searching: false,
    });
    dropdownRef.current?.open();
  };

  const isEmpty = () =>
    !state.inputValue && !state.value.length;

  const renderOption = (o, index) => (
    <DropdownItem
      key={index}
      tabIndex={0}
    >
      <a
        href="#"
        onClick={onOptionClick_.bind(null, o)}
        tabIndex={-1}
      >
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
        'tags-input',
        {
          focused: state.focused,
          labeled: !!label,
          'label-enforced': forceLabel,
          dirty: state.dirty || state.inputDirty,
          empty: isEmpty(),
          searching: state.searching,
          'with-search': !!search,
          invalid: (!state.valid && state.dirty) ||
            (!state.inputValid && state.inputDirty),
          disabled,
        },
        className,
      )}
    >
      <div ref={wrapperRef} className="wrapper" onMouseDown={onWrapperClick_}>
        { state.value.map?.((tag, i) => (
          <span
            tabIndex={0}
            key={i}
            className={classNames(
              'tag',
              {
                invalid: !validateTag(tag),
              },
            )}
            onKeyDown={onTagKeyDown_.bind(null, i)}
          >
            { parseTitle(tag) }
            <a
              tabIndex={-1}
              className="remove"
              href="#"
              onClick={remove.bind(null, i)}
            />
          </span>
        ))}
        <div className="input">
          <input
            type="text"
            value={state.inputValue}
            ref={inputRef}
            onChange={onInputChange_}
            onKeyPress={onKeyPress_}
            onKeyDown={onKeyDown_}
            onFocus={onInputFocus_}
            onBlur={onInputBlur_}
            autoFocus={autoFocus}
            disabled={disabled}
          />
          { !state.inputValue && placeholder && (
            <span className="placeholder">{ placeholder }</span>
          )}
        </div>
        <span className="label">{ label || placeholder }</span>
      </div>

      { (search || state.availableOptions?.length) && (
        <Dropdown
          opened={state.opened}
          ref={dropdownRef}
          onToggle={onDropdownToggle_}
          clickOutsideTarget={wrapperRef.current}
          globalEventsTarget={globalEventsTarget}
        >
          <DropdownToggle tag="div" trigger="manual" tabIndex={-1} />
          <DropdownMenu ref={menuRef}>
            { state.searchResults ? (
              <div className="search-results">
                { state.searchResults.length
                  ? state.searchResults
                    ?.map((o, index) => renderOption(o, index))
                  : (
                    <div className="no-results">{ noSearchResults }</div>
                  ) }
              </div>
            ) : (
              <div className="items">
                { state.availableOptions
                  ?.map((o, index) => renderOption(o, index)) }
              </div>
            ) }
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
});

TagsField.propTypes = {
  autoFocus: PropTypes.bool,
  autoAddOnBlur: PropTypes.bool,
  autoSearchOnFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  forceLabel: PropTypes.bool,
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
  noSearchResults: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  onlyAllowOptions: PropTypes.bool,
  onlyAllowOneOccurence: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyPress: PropTypes.func,
  onToggle: PropTypes.func,
  parseTitle: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  required: PropTypes.bool,
  search: PropTypes.func,
  searchMinCharacters: PropTypes.number,
  searchThreshold: PropTypes.number,
  validate: PropTypes.func,
  validateInput: PropTypes.func,
  validateTag: PropTypes.func,
  value: PropTypes.array,
  parseValue: PropTypes.func,
};

export default TagsField;
