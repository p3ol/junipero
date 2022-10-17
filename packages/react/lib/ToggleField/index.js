import { forwardRef, useImperativeHandle, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { classNames, mockState } from '@junipero/core';

const ToggleField = forwardRef(({
  checked = false,
  disabled,
  children,
  valid,
  className,
  value,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    checked,
    dirty: false,
    valid,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    isJunipero: true,
  }));

  const onChange_ = e => {
    console.log(e);
    state.checked = e?.target?.checked ?? false;
    dispatch({ checked: state.checked });
  };

  return (
    <label
      ref={innerRef}
      className={classNames(
        'junipero',
        'toggle-field', {
          disabled,
          checked: state.checked,
        },
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        className
      )}
      tabIndex={1}
    >
      <input
        { ...rest }
        ref={inputRef}
        type="checkbox"
        value={value}
        disabled={disabled}
        checked={state.checked}
        onChange={onChange_}
        tabIndex={-1}
      />
      <div className="inner">
        <div className="handle" />
      </div>
      <div className="label">
        {children}
      </div>
    </label>
  );
});

ToggleField.displayName = 'ToggleField';
ToggleField.propTypes = {
  value: PropTypes.any,
  checked: PropTypes.bool,
  valid: PropTypes.bool,
  dirty: PropTypes.bool,
  disabled: PropTypes.bool,
};
export default ToggleField;
