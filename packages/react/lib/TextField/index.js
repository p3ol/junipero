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
  autoFocus,
  className,
  valid,
  value,
  disabled = false,
  required = false,
  type = 'text',
  onBlur,
  onChange,
  onFocus,
  onValidate = (val, { required } = {}) => !!val || !required,
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
    internalValue: state.value,
    valid: state.valid,
    dirty: state.dirty,
    focused: state.focused,
    reset,
    isJunipero: true,
  }));

  useEffect(() => {
    if (exists(value)) {
      state.value = value;
      state.valid = onValidate?.(state.value, { dirty: state.dirty, required });
      dispatch({ value: state.value, valid: state.valid });
      updateControl?.({ valid: state.valid, dirty: state.dirty });
    }
  }, [value]);

  useEffect(() => {
    dispatch({ valid: valid ?? false });
    updateControl?.({ valid: state.valid });
  }, [valid]);

  const onChange_ = e => {
    if (disabled) {
      return;
    }

    state.value = e?.target?.value || '';
    state.dirty = true;
    state.valid = onValidate(state.value, { dirty: state.dirty, required });
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

  const reset = () => {
    dispatch({ value: value ?? '', valid: valid ?? false, dirty: false });
    updateControl?.({ dirty: false, valid: state.valid });
  };

  const isEmpty = () =>
    !exists(state.value) || state.value === '';

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
      />
    </div>
  );
});

TextField.displayName = 'TextField';
TextField.propTypes = {
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
  onValidate: PropTypes.func,
};

export default TextField;
