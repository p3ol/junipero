import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { classNames, mockState, exists } from '@junipero/core';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';

const TextField = forwardRef(({
  min,
  max,
  autoFocus,
  children,
  className,
  valid,
  value,
  disabled = false,
  required = false,
  type = 'text',
  onBlur,
  onChange,
  onFocus,
  onWheel,
  onValidate = (val, { required }) => !!val || !required,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState, {
    value: value ?? '',
    valid: valid ?? false,
    focused: autoFocus ?? false,
    dirty: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    value: state.value,
    valid: state.valid,
    dirty: state.dirty,
    focused: state.focused,
    focus,
    blur,
    reset,
    setDirty,
    isJunipero: true,
  }));

  useEffect(() => {
    if (exists(value)) {
      state.value = value;
      state.valid = onValidate(state.value, { dirty: state.dirty, required });
      dispatch({ value: state.value, valid: state.valid });
      updateControl?.({ valid: state.valid, dirty: state.dirty });
    }
  }, [value]);

  useEffect(() => {
    dispatch({ valid: valid ?? false });
    updateControl?.({ valid: state.valid });
  }, [valid]);

  const parseValue = value => {
    const value_ = value.replace(',', '.');
    const parsedValue = parseFloat(value_);

    return !isNaN(parsedValue) ? parsedValue : value_;
  };

  const onChange_ = e => {
    /* html input disabled attribute will prevent onChange if present anyway */
    /* istanbul ignore next: just in case */
    if (disabled) {
      return;
    }

    if (type === 'number') {
      value = parseValue(e?.target?.value);
    } else {
      value = e?.target?.value;
    }

    state.value = value;
    state.dirty = true;
    state.valid = onValidate(
      state.value, { dirty: state.dirty, required }
    );
    dispatch({ value: state.value, dirty: state.dirty });
    onChange?.({ value: state.value, valid: state.valid, dirty: state.dirty });
    updateControl?.({ dirty: true, valid: state.valid });
  };

  const onFocus_ = e => {
    dispatch({ focused: true });
    updateControl?.({ focused: true });
    onFocus?.(e);
  };

  const onBlur_ = e => {
    dispatch({ focused: false });
    updateControl?.({ focused: false });
    onBlur?.(e);
  };

  const focus = () => {
    inputRef.current?.focus();
  };

  const blur = () => {
    inputRef.current?.blur();
  };

  const reset = () => {
    dispatch({ value: value ?? '', valid: valid ?? false, dirty: false });
    updateControl?.({ dirty: false, valid: valid ?? false });
  };

  const isEmpty = () =>
    !exists(state.value) || state.value === '';

  const setDirty = dirty => {
    state.dirty = dirty;
    dispatch({ dirty });
    updateControl?.({ dirty });
  };

  const Tag = rest.rows > 1 ? 'textarea' : 'input';

  return (
    <div
      ref={innerRef}
      className={classNames(
        'junipero',
        'text-field',
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        { empty: isEmpty(), focused: state.focused, disabled },
        className
      )}
    >
      <Tag
        { ...rest }
        min={min}
        max={max}
        autoFocus={autoFocus}
        className="field"
        ref={inputRef}
        disabled={disabled}
        required={required}
        type={Tag === 'textarea' ? undefined : type}
        value={state.value}
        onChange={onChange_}
        onFocus={onFocus_}
        onBlur={onBlur_}
        onWheel={onWheel ?? (() => inputRef.current?.blur())}
      />
      { children }
    </div>
  );
});

TextField.displayName = 'TextField';
TextField.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  type: PropTypes.string,
  valid: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onWheel: PropTypes.func,
  onValidate: PropTypes.func,
};

export default TextField;
