import React, {
  forwardRef,
  useRef,
  useReducer,
  useEffect,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';

import { classNames, mockState } from '../utils';
import { useEventListener } from '../hooks';

const CheckboxField = forwardRef(({
  checked,
  children,
  className,
  id,
  name,
  value,
  globalEventsTarget = global,
  onChange = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    checked: checked ?? false,
    focused: false,
    active: false,
  });

  useEffect(() => {
    dispatch({ checked: checked ?? false });
  }, [checked]);

  useEventListener('mouseup', () => {
    dispatch({ active: false });
  }, globalEventsTarget);

  useEventListener('keypress', e => {
    onKeyPress_(e);
  }, globalEventsTarget);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
  }));

  const onKeyPress_ = e => {
    if (state.focused && (e.key === 'Enter' || e.key === ' ')) {
      state.checked = !state.checked;
      dispatch({ checked: state.checked });
      e.preventDefault?.();
      return false;
    }

    return true;
  };

  const onChange_ = e => {
    state.checked = e?.target?.checked ?? false;
    dispatch({ checked: state.checked });
    onChange({ value, checked: state.checked });
  };

  const onMouseDown_ = () => {
    dispatch({ active: true });
  };

  const onFocus_ = (...args) => {
    dispatch({ focused: true });
  };

  const onBlur_ = (...args) => {
    dispatch({ focused: false });
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
          checked: state.checked,
          focused: state.focused,
        }
      )}
      onMouseDown={onMouseDown_}
      onFocus={onFocus_}
      onBlur={onBlur_}
      tabIndex={1}
    >
      <div className="check">
        <input
          { ...rest }
          ref={inputRef}
          type="checkbox"
          value={value}
          checked={state.checked}
          onChange={onChange_}
          tabIndex={-1}
        />
        <div className="inner" />
      </div>
      <div className="content">{ children }</div>
    </label>
  );
});

CheckboxField.propTypes = {
  checked: PropTypes.bool,
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func,
};

export default CheckboxField;
