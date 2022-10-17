import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, mockState } from '@junipero/core';

const Toggle = forwardRef(({
  checked = false,
  disabled = false,
  dirty = false,
  children,
  className,
  value,
  onChange,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();

  const [state, dispatch] = useReducer(mockState, {
    checked,
    dirty,
  });

  useEffect(() => {
    dispatch({ checked });
  }, [checked]);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    isJunipero: true,
  }));

  const onKeyPress = e => {
    if (
      e.key === 'Enter' || e.key === ' '
    ) {
      onChange_(e);
    }
  };

  const onChange_ = () => {
    if (disabled) {
      /* istanbul ignore next: canoot be tested */
      return;
    }

    state.checked = !state.checked;

    dispatch({ checked: state.checked, dirty: true });
    onChange?.({ value, checked: state.checked });
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
        className
      )}
      tabIndex={1}
      onKeyPress={onKeyPress}
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

Toggle.displayName = 'Toggle';
Toggle.propTypes = {
  value: PropTypes.any,
  checked: PropTypes.bool,
  valid: PropTypes.bool,
  dirty: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onValidate: PropTypes.func,
  onChange: PropTypes.func,
};
export default Toggle;
