import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { classNames, mockState } from '@junipero/core';
import PropTypes from 'prop-types';

const Toggle = forwardRef(({
  checked = false,
  disabled = false,
  tabIndex = 1,
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
  });

  useEffect(() => {
    dispatch({ checked });
  }, [checked]);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    checked: state.checked,
    isJunipero: true,
  }));

  const onKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      onChange_(e);
    }
  };

  const onChange_ = () => {
    if (disabled) {
      /* istanbul ignore next: canoot be tested */
      return;
    }

    state.checked = !state.checked;

    dispatch({ checked: state.checked });
    onChange?.({ value, checked: state.checked });
  };

  return (
    <label
      ref={innerRef}
      className={classNames(
        'junipero',
        'toggle-field',
        {
          disabled,
          checked: state.checked,
        },
        className
      )}
      tabIndex={tabIndex}
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
      { children && (
        <div className="label">
          {children}
        </div>
      ) }
    </label>
  );
});

Toggle.displayName = 'Toggle';
Toggle.propTypes = {
  value: PropTypes.any,
  checked: PropTypes.bool,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Toggle;
