import { forwardRef, useImperativeHandle, useReducer, useRef } from 'react';
import { classNames, mockState } from '@junipero/core';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';
import { Check } from '../icons';

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
    checked: checked ?? false,
    valid: valid ?? true,
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
      e.preventDefault?.();

      state.checked = !state.checked;
      const valid = onValidate?.(state.checked, { dirty: true, required });
      dispatch({ checked: state.checked, valid, dirty: true });
      onChange?.({ value, checked: state.checked });
      updateControl?.({ dirty: true, valid });

      return false;
    }

    return true;
  };

  const onChange_ = e => {
    if (disabled) {
      return;
    }

    const checked = e?.target?.checked ?? false;
    const valid = onValidate(checked, { dirty: true, required });
    dispatch({ checked, valid, dirty: true });
    onChange?.({ value, checked });
    updateControl?.({ dirty: true, valid });
  };

  return (
    <label
      htmlFor={id}
      { ...rest }
      ref={innerRef}
      className={classNames(
        'junipero',
        'checkbox-field',
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        {
          disabled,
          checked: state.checked,
        },
        className
      )}
      onKeyPress={onKeyPress_}
      tabIndex={disabled ? -1 : 1}
    >
      <input
        id={id}
        type="checkbox"
        ref={inputRef}
        value={value}
        checked={state.checked}
        onChange={onChange_}
        tabIndex={-1}
      />
      <div className="inner">
        <Check />
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
