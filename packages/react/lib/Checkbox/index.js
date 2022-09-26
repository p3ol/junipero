import { forwardRef, useImperativeHandle, useReducer, useRef } from 'react';
import { classNames, mockState } from '@junipero/core';
import { useEventListener } from '@junipero/hooks';
import PropTypes from 'prop-types';

const Checkbox = forwardRef(({
  children,
  checked = false,
  value,
  id,
  globalEventsTarget = global,
  className,
  disabled = false,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    internalValue: state.checked,
    focused: state.focused,
    active: state.active,
    isJunipero: true,
  }));

  const [state, dispatch] = useReducer(mockState, {
    active: false,
    checked,
    focused: false,
  });

  const onBlur_ = e => {
    if (!disabled) {
      dispatch({ focused: false });
      onBlur(e);
    }
  };

  const onMouseDown_ = () => {
    if (!disabled) {
      dispatch({ active: true });
    }
  };

  useEventListener('mouseup', () => {
    if (!disabled) {
      dispatch({ active: false });
    }
  }, globalEventsTarget);

  const onFocus_ = e => {
    if (!disabled) {
      dispatch({ focused: true });
      onFocus(e);
    }
  };

  useEventListener('keypress', e => {

    if (!disabled) {
      onKeyPress_(e);
    }
  }, globalEventsTarget);

  const onKeyPress_ = e => {

    if (state.focused && (e.key === 'Enter' || e.key === ' ')) {
      state.checked = !state.checked;
      dispatch({ checked: state.checked });
      onChange({ value, checked: state.checked });
      e.preventDefault?.();

      return false;
    }

    return true;
  };

  const onChange_ = e => {
    if (!disabled) {
      const checked = e?.target?.checked ?? false;
      dispatch({ checked });
      onChange({ value, checked });
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
          active: state.active,
          disabled,
          checked: state.checked,
          focused: state.focused,
        },
        className
      )}
      onMouseDown={onMouseDown_}
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

Checkbox.displayName = 'Checkbox';
Checkbox.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
};

export default Checkbox;
