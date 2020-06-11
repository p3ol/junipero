import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import { classNames, mockState, exists } from '../utils';

const TextField = forwardRef(({
  autoFocus,
  className,
  placeholder,
  label,
  valid,
  value,
  disabled = false,
  forceLabel = false,
  required = false,
  type = 'text',
  onBlur = () => {},
  onChange = () => {},
  onFocus = () => {},
  validate = val => !!val || !required,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    dirty: false,
    valid: valid ?? false,
    value: value ?? '',
    focused: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    internalValue: state.value,
    valid: state.valid,
    dirty: state.dirty,
    focused: state.focused,
    reset,
    focus,
    blur,
    setDirty,
  }));

  useEffect(() => {
    if (exists(value)) {
      state.value = value;
      state.valid = validate(state.value, { dirty: state.dirty, required });
      dispatch({ value: state.value, valid: state.valid });
    }
  }, [value]);

  const onChange_ = e => {
    if (disabled) {
      return;
    }

    state.value = e?.target?.value || '';
    state.dirty = true;
    state.valid = validate(state.value, { dirty: state.dirty, required });
    dispatch({ value: state.value, dirty: state.dirty });
    onChange({ value: state.value, valid: state.valid, dirty: state.dirty });
  };

  const onFocus_ = e => {
    dispatch({ focused: true });
    onFocus(e);
  };

  const onBlur_ = e => {
    dispatch({ focused: false });
    onBlur(e);
  };

  const reset = () =>
    dispatch({ value: value ?? '', valid: valid ?? false, dirty: false });

  const focus = () =>
    inputRef.current?.focus();

  const blur = () =>
    inputRef.current?.blur();

  const setDirty = dirty =>
    dispatch({ dirty });

  const isEmpty = () =>
    !state.value;

  return (
    <div
      ref={innerRef}
      className={classNames(
        'junipero',
        'field',
        'text-input',
        {
          labeled: !!label,
          'label-enforced': forceLabel,
          dirty: state.dirty,
          empty: isEmpty(),
          disabled,
          invalid: !state.valid && state.dirty,
        },
        className
      )}
    >
      <input
        { ...rest }
        ref={inputRef}
        autoFocus={autoFocus}
        disabled={disabled}
        required={required}
        type={type}
        value={state.value}
        onBlur={onBlur_}
        onChange={onChange_}
        onFocus={onFocus_}
      />
      { isEmpty() && placeholder && (
        <span className="placeholder">{ placeholder }</span>
      )}
      <span className="label">{ label || placeholder }</span>
    </div>
  );
});

TextField.propTypes = {
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  forceLabel: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
    PropTypes.bool,
  ]),
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
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
  validate: PropTypes.func,
};

export default TextField;
