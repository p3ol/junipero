import { forwardRef, useImperativeHandle, useReducer, useRef } from 'react';
import { classNames, mockState } from '@junipero/core';
import { useEventListener } from '@junipero/hooks';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';

const CheckboxField = forwardRef(({
  children,
  checked = false,
  valid = true,
  value,
  id,
  globalEventsTarget,
  className,
  disabled = false,
  required = false,
  onChange,
  onFocus,
  onBlur,
  onValidate = (val, { required }) => val || !required,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();

  const { update: updateControl } = useFieldControl();

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    checked: state.checked,
    isJunipero: true,
  }));

  const [state, dispatch] = useReducer(mockState, {
    checked,
    valid,
    focused: false,
  });

  const onBlur_ = e => {
    if (!disabled) {
      dispatch({ focused: false });
      onBlur?.(e);
    }
  };

  const onFocus_ = e => {
    if (!disabled) {
      dispatch({ focused: true });
      onFocus?.(e);
    }
  };

  useEventListener('keypress', e => {

    if (!disabled) {
      onKeyPress_(e);
    }
  }, { target: globalEventsTarget });

  const onKeyPress_ = e => {

    if (state.focused && (e.key === 'Enter' || e.key === ' ')) {
      state.checked = !state.checked;
      const valid = onValidate?.(
        state.checked, { dirty: state.dirty, required }
      );
      dispatch({ checked: state.checked, valid });
      onChange?.({ value, checked: state.checked });
      updateControl?.({
        dirty: true,
        valid,
      });
      e.preventDefault?.();

      return false;
    }

    return true;
  };

  const onChange_ = e => {
    if (!disabled) {
      const checked = e?.target?.checked ?? false;
      const valid = onValidate?.(checked, { dirty: state.dirty, required });
      dispatch({ checked, valid });
      onChange?.({ value, checked });

      updateControl?.({
        dirty: true,
        valid,
      });
    }
  };

  return (
    <label
      htmlFor={id}
      ref={innerRef}
      className={classNames(
        'junipero',
        'field',
        'checkbox',
        {
          disabled,
          checked: state.checked,
          invalid: !state.valid,
        },
        className
      )}
      onFocus={onFocus_}
      onBlur={onBlur_}
      tabIndex={disabled ? -1 : 1}
    >
      <div className="check">
        <input
          { ...rest }
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

CheckboxField.displayName = 'Checkbox';
CheckboxField.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  required: PropTypes.bool,
  onValidate: PropTypes.func,
  valid: PropTypes.bool,
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
};

export default CheckboxField;
