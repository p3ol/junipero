import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, exists, mockState } from '@poool/junipero-utils';
import { useEventListener } from '@poool/junipero-hooks';

const RadioField = forwardRef(({
  className,
  checked = false,
  description,
  disabled = false,
  globalEventsTarget = global,
  id,
  label,
  value,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    checked: checked ?? false,
    focused: false,
  });

  useEffect(() => {
    dispatch({ checked: checked ?? false });
  }, [checked]);

  useEventListener('keypress', e => {
    onKeyPress_(e);
  }, globalEventsTarget);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
  }));

  const onKeyPress_ = e => {
    if (disabled) {
      return;
    }

    if (
      !state.checked &&
      state.focused &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      state.checked = true;
      dispatch({ checked: state.checked });
      e.preventDefault?.();
      onChange({ value, checked: state.checked });

      return false;
    }

    return true;
  };

  const onChange_ = e => {
    state.checked = e?.target?.checked ?? false;
    dispatch({ checked: state.checked });
    onChange({ value, checked: state.checked });
  };

  const onFocus_ = e => {
    dispatch({ focused: true });
    onFocus(e);
  };

  const onBlur_ = e => {
    dispatch({ focused: false });
    onBlur(e);
  };

  return (
    <label
      htmlFor={id}
      ref={innerRef}
      className={classNames(
        'junipero',
        'field',
        'radio',
        {
          active: state.active,
          checked: state.checked,
          focused: state.focused,
          boxed: exists(description),
          disabled,
        },
        className
      )}
      onFocus={onFocus_}
      onBlur={onBlur_}
      tabIndex={!disabled ? 1 : null}
    >
      <input
        { ...rest }
        id={id}
        ref={inputRef}
        type="radio"
        value={value}
        checked={state.checked}
        onChange={onChange_}
        tabIndex={-1}
      />
      <div className="inner">
      </div>
      <div className="label">
        <div>{ label }</div>
        { description && <div className="description">{description}</div>}
      </div>
    </label>
  );
});

RadioField.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  description: PropTypes.string,
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.bool,
  ]),
};

export default RadioField;
