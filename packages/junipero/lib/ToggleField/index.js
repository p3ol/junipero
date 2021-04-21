import React, {
  forwardRef,
  useRef,
  useReducer,
  useEffect,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, mockState } from '@poool/junipero-utils';
import { useEventListener } from '@poool/junipero-hooks';

const ToggleField = forwardRef(({
  checked,
  checkedLabel,
  className,
  id,
  uncheckedLabel,
  value,
  globalEventsTarget = global,
  animateLabel = label => label,
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
    focused: state.focused,
  }));

  const onKeyPress_ = e => {
    if (state.focused && (e.key === 'Enter' || e.key === ' ')) {
      state.checked = !state.checked;
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
        'toggle',
        {
          active: state.active,
          checked: state.checked,
          focused: state.focused,
        },
        className
      )}
      onFocus={onFocus_}
      onBlur={onBlur_}
      tabIndex={1}
    >
      <input
        { ...rest }
        id={id}
        ref={inputRef}
        type="checkbox"
        value={value}
        checked={state.checked}
        onChange={onChange_}
        tabIndex={-1}
      />
      <div className="inner">
        <div className="handle" />
      </div>
      <div className="label">
        { animateLabel(checked
          ? checkedLabel || uncheckedLabel
          : uncheckedLabel || checkedLabel
        ) }
      </div>
    </label>
  );
});

ToggleField.propTypes = {
  animateLabel: PropTypes.func,
  checked: PropTypes.bool,
  checkedLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
    PropTypes.bool,
  ]),
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  uncheckedLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
    PropTypes.bool,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.bool,
  ]),
};

export default ToggleField;
