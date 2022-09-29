import { forwardRef, useImperativeHandle, useReducer, useRef } from 'react';
import { classNames, mockState } from '@junipero/core';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';

const CheckboxField = forwardRef(({
  checked = false,
  valid = true,
  disabled = false,
  required = false,
  children,
  value,
  id,
  className,
  onChange,
  onValidate = (val, { required }) => val || !required,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();

  const { update: updateControl } = useFieldControl();

  const [state, dispatch] = useReducer(mockState, {
    checked,
    valid,
    dirty: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    checked: state.checked,
    isJunipero: true,
  }));

  const onKeyPress_ = e => {

    if (e.key === 'Enter' || e.key === ' ') {
      state.checked = !state.checked;
      state.dirty = true;
      const valid = onValidate?.(
        state.checked, { dirty: state.dirty, required }
      );
      dispatch({ checked: state.checked, valid, dirty: state.dirty });
      onChange?.({ value, checked: state.checked });
      updateControl?.({
        dirty: state.dirty,
        valid,
      });
      e.preventDefault?.();

      return false;
    }

    return true;
  };

  const onChange_ = e => {
    if (disabled) {
      return;
    }

    const checked = e?.target?.checked ?? false;
    state.dirty = true;
    const valid = onValidate?.(checked, { dirty: state.dirty, required });
    dispatch({ checked, valid, dirty: state.dirty });
    onChange?.({ value, checked });

    updateControl?.({
      dirty: state.dirty,
      valid,
    });
  };

  return (
    <label
      htmlFor={id}
      { ...rest }
      ref={innerRef}
      className={classNames(
        'checkbox-field',
        'junipero',
        {
          disabled,
          checked: state.checked,
          invalid: !state.valid,
        },
        className
      )}
      onKeyPress={onKeyPress_}
      tabIndex={disabled ? -1 : 1}
    >
      <div className="check">
        <input
          id={id}
          type="checkbox"
          ref={inputRef}
          value={value}
          checked={state.checked}
          onChange={onChange_}
          tabIndex={-1}
        />
        <div className="inner" />
      </div>
      <div className="content">{children}</div>
    </label>
  );
});

CheckboxField.displayName = 'CheckboxField';
CheckboxField.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  onValidate: PropTypes.func,
  valid: PropTypes.bool,
};

export default CheckboxField;
