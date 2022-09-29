import { forwardRef, useImperativeHandle, useReducer, useRef } from 'react';
import { classNames, mockState } from '@junipero/core';
import { useEventListener } from '@junipero/hooks';
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
  globalEventsTarget,
  className,
  onChange,
  onFocus,
  onBlur,
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
    focused: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    checked: state.checked,
    isJunipero: true,
  }));

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

CheckboxField.displayName = 'CheckboxField';
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
